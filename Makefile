all:
	rm -rf dist NTRUEncrypt libsodium 2> /dev/null
	mkdir dist

	git clone --depth 1 -b stable https://github.com/jedisct1/libsodium
	cd libsodium ; emconfigure ./configure --enable-minimal --disable-shared

	git clone --depth 1 https://github.com/NTRUOpenSourceProject/NTRUEncrypt

	bash -c ' \
		args="$$(echo " \
			-s SINGLE_FILE=1 \
			-DPARAMS=NTRU_EES743EP1 \
			-s TOTAL_MEMORY=16777216 -s TOTAL_STACK=8388608 \
			-s ASSERTIONS=0 \
			-s AGGRESSIVE_VARIABLE_ELIMINATION=1 -s ALIASING_FUNCTION_POINTERS=1 \
			-s FUNCTION_POINTER_ALIGNMENT=1 -s DISABLE_EXCEPTION_CATCHING=1 \
			-s RESERVED_FUNCTION_POINTERS=8 -s NO_FILESYSTEM=1 \
			-Ilibsodium/src/libsodium/include/sodium \
			-INTRUEncrypt/include -INTRUEncrypt/src \
			libsodium/src/libsodium/randombytes/randombytes.c \
			$$(ls NTRUEncrypt/src/*.c | grep -v _simd.c | grep -v _32.c | grep -v _64.c) \
			ntru.c \
			-s EXPORTED_FUNCTIONS=\"[ \
				'"'"'_free'"'"', \
				'"'"'_malloc'"'"', \
				'"'"'_ntrujs_init'"'"', \
				'"'"'_ntrujs_keypair'"'"', \
				'"'"'_ntrujs_encrypt'"'"', \
				'"'"'_ntrujs_decrypt'"'"', \
				'"'"'_ntrujs_public_key_bytes'"'"', \
				'"'"'_ntrujs_private_key_bytes'"'"', \
				'"'"'_ntrujs_encrypted_bytes'"'"', \
				'"'"'_ntrujs_decrypted_bytes'"'"' \
			]\" \
		" | perl -pe "s/\s+/ /g" | perl -pe "s/\[ /\[/g" | perl -pe "s/ \]/\]/g")"; \
		\
		bash -c "emcc -Oz -s RUNNING_JS_OPTS=1 $$args -o dist/ntru.asm.js"; \
		bash -c "emcc -O3 -s WASM=1 $$args -o dist/ntru.wasm.js"; \
	'

	cp pre.js dist/ntru.tmp.js
	echo " \
		var Module = {}; \
		var _Module = Module; \
		Module.ready = new Promise(function (resolve, reject) { \
			var Module = _Module; \
			Module.onAbort = reject; \
			Module.onRuntimeInitialized = resolve; \
	" >> dist/ntru.tmp.js
	cat dist/ntru.wasm.js >> dist/ntru.tmp.js
	echo " \
		}).catch(function () { \
			var Module = _Module; \
			Module.onAbort = undefined; \
			Module.onRuntimeInitialized = undefined; \
	" >> dist/ntru.tmp.js
	cat dist/ntru.asm.js >> dist/ntru.tmp.js
	echo " \
		}); \
	" >> dist/ntru.tmp.js
	cat post.js >> dist/ntru.tmp.js

	uglifyjs dist/ntru.tmp.js -cmo dist/ntru.js

	sed -i 's|use asm||g' dist/ntru.js
	sed -i 's|require(|eval("require")(|g' dist/ntru.js

	rm -rf NTRUEncrypt libsodium dist/ntru.*.js

clean:
	rm -rf dist NTRUEncrypt libsodium
