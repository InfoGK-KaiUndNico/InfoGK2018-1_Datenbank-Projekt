import validator from 'validator';

export default function checkUserdata(
	input: string,
	maxLength: number,
	{checkWhitespace, checkLength,  }: { checkWhitespace: boolean; checkLength: boolean;  } = {
		checkWhitespace: true,
		checkLength: true
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

	return validator.isAlphanumeric(input);
}
