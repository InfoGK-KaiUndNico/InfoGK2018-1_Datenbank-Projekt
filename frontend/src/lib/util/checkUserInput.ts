import validator from 'validator';

export default function checkUserdata(
	input: string,
	maxLength: number,
	{checkWhitespace, checkLength, checkAlphanumeric }: { checkWhitespace: boolean; checkLength: boolean; checkAlphanumeric: boolean } = {
		checkWhitespace: true,
		checkLength: true,
		checkAlphanumeric: true
	}
) {
	if (checkWhitespace && /\s+/.test(input) === true) {
		return false;
	}

	if (checkLength && input.length < 1) {
		return false;
	}

	if (input.length > maxLength) {
		return false;
	}

	if (checkAlphanumeric && !validator.isAlphanumeric(input)) {
		return false;
	}

	return true;
}
