all:
	rm -rf dist NTRUEncrypt libsodium 2> /dev/null
	mkdir dist

	git clone -b stable https://github.com/jedisct1/libsodium.git
	cd libsodium ; emconfigure ./configure --enable-minimal --disable-shared

	git clone https://github.com/NTRUOpenSourceProject/NTRUEncrypt.git

	bash -c ' \
		args="$$(echo " \
			--memory-init-file 0 \
			-DPARAMS=NTRU_EES743EP1 \
			-s TOTAL_MEMORY=65536 -s TOTAL_STACK=32768 \
			-s NO_DYNAMIC_EXECUTION=1 -s RUNNING_JS_OPTS=1 -s ASSERTIONS=0 \
			-s AGGRESSIVE_VARIABLE_ELIMINATION=1 -s ALIASING_FUNCTION_POINTERS=1 \
			-s FUNCTION_POINTER_ALIGNMENT=1 -s DISABLE_EXCEPTION_CATCHING=1 \
			 -s RESERVED_FUNCTION_POINTERS=8 -s NO_FILESYSTEM=1 \
			-Ilibsodium/src/libsodium/include/sodium \
			-INTRUEncrypt/include -INTRUEncrypt/src \
			libsodium/src/libsodium/randombytes/randombytes.c \
			$$(ls NTRUEncrypt/src/*.c | grep -v _simd.c | grep -v _32.c | grep -v _64.c) \
			ntru.c \
			-s EXPORTED_FUNCTIONS=\"[ \
				'"'"'_ntrujs_init'"'"', \
				'"'"'_ntrujs_keypair'"'"', \
				'"'"'_ntrujs_encrypt'"'"', \
				'"'"'_ntrujs_decrypt'"'"', \
				'"'"'_ntrujs_public_key_bytes'"'"', \
				'"'"'_ntrujs_private_key_bytes'"'"', \
				'"'"'_ntrujs_encrypted_bytes'"'"', \
				'"'"'_ntrujs_decrypted_bytes'"'"' \
			]\" \
			--pre-js pre.js --post-js post.js \
		" | perl -pe "s/\s+/ /g" | perl -pe "s/\[ /\[/g" | perl -pe "s/ \]/\]/g")"; \
		\
		bash -c "emcc -O3 $$args -o dist/ntru.js"; \
		bash -c "emcc -O0 -g4 $$args -o dist/ntru.debug.js"; \
	'

	sed -i 's|require(|eval("require")(|g' dist/ntru.js

	rm -rf NTRUEncrypt libsodium

clean:
	rm -rf dist NTRUEncrypt libsodium
