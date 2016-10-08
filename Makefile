.PHONY: rebuild clean

rebuild: clean app/bundle.js

app/bundle.js:
	browserify main.js -o app/bundle.js

clean:
	rm -f app/bundle.js
