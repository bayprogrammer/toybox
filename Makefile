.PHONY: rebuild clean

rebuild: clean public/bundle.js

clean:
	rm -f public/bundle.js

public/bundle.js:
	browserify main.js -o public/bundle.js
