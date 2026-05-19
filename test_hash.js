const hash = "access_token=eyJhb...&refresh_token=kgrqpgef5ayn&token_type=bearer";
const hashParams = new URLSearchParams(hash);
console.log(hashParams.get('access_token'));
console.log(hashParams.get('refresh_token'));
