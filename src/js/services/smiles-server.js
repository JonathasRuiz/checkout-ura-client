module.exports.SmilesServer = () => {

	var host = "http://localhost.smiles.com.br:8888";
	var timeoutTime = 30000;
	var checkoutToken = "";

	var getHeaders = () => {
		return {
			"Authorization": "Bearer " + checkoutToken,
			"Channel": "APP",
			"Content-Type": "application/json"
		}
	};

	var get = (url) => {
		console.info("server-get: " + url);
		var defer = $.Deferred();
		$.ajax({
			url: url,
			type: "GET",
			dataType: "json",
			headers: getHeaders(),
			timeout: timoutTime
		})
		.done((data) => defer.resolve(data))
		.fail((data) => defer.reject(data));
		return defer.promise();
	};
	var post = (url, data) => {
		console.info("server-post: " + url, data);
		var defer = $.Deferred();
		$.ajax({
			url: url,
			type: "POST",
			data: data,
			dataType: "json",
			headers: getHeaders(),
			timeout: timoutTime
		})
		.done((data) => defer.resolve(data))
		.fail((data) => defer.reject(data));
		return defer.promise();
	};

	var getTokenInfo = () => {
		let url = host + "/api/oauth/tokeninfo";
		let defer = $.Deferred();
		get(url)
			.then((data) => {
				console.info(data);
			})
			.catch((err) => defer.reject(err));
		return defer.promise();
	};

	var testSmile = () => {
		console.info("test-smile");
	};

	return {
		getTokenInfo: getTokenInfo,
		test: testSmile
	};

};
