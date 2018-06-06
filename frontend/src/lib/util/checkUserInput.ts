import validator from 'validator';

export default function checkUserdata(
	input: string,
	maxLength: number,
	{checkWhitespace, checkLength, checkAlphanumeric }: { checkWhitespace?: boolean; checkLength?: boolean; checkAlphanumeric?: boolean } = {
		checkWhitespace: true,
		checkLength: true,
		checkAlphanumeric: true
	}
) {
	// check for whitespace
	if (checkWhitespace && /\s+/.test(input) === true) {
		return false;
	}

	// check for empty field
	if (checkLength && input.length < 1) {
		return false;
	}

	// check for exeding length
	if (input.length > maxLength) {
		return false;
	}

	// check for special characters
	if (checkAlphanumeric && !validator.isAlphanumeric(input)) {
		return false;
	}

	return true;
}
