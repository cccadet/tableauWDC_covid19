(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "city_ibge_code",
            alias: "city_ibge_code",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "city",
            alias: "city",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "confirmed",
            alias: "confirmed",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "confirmed_per_100k_inhabitants",
            alias: "confirmed_per_100k_inhabitants",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "estimated_population_2019",
            alias: "estimated_population_2019",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "order_for_place",
            alias: "order_for_place",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "state",
            alias: "state",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "deaths",
            alias: "deaths",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "place_type",
            alias: "place_type",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "date",
            alias: "date",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "death_rate",
            alias: "death_rate",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "is_last",
            alias: "is_last",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "CasosCovid",
            //alias: "",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
	
	myConnector.getData = function (table, doneCallback) {
		 function getPageData(page) {
			// Promises são objetos que foram introduzidos pra transformar rotinas assíncronas em rotinas sícronas
			return new Promise(function (resolve) {
				$.getJSON("https://brasil.io/api/dataset/covid19/caso/data?page=" + page, function(resp) {
					resolve(/* Resultado do await desta Promise será 'resp' */ resp);
				}).fail(function () {
					resolve(null);
				});
			});
		}

		// Para transformar uma promise em sícrona todo o código deve estar dentro de uma função assíncrona
		(async function () {
			var data = [];
			var page = 1;

			// O await vai fazer o código parar até a função resolve da Promise ser chamada
			// O argumento passado para a função resolve será o resultado do await
			var resp = await getPageData(page++);

			while (resp) {
				var feat = resp.results;

				for (var i = 0, len = feat.length; i < len; i++) {
					data.push({
						"city_ibge_code"                : feat[i].city_ibge_code,
						"city"                          : feat[i].city,
						"confirmed"                     : feat[i].confirmed,
						"confirmed_per_100k_inhabitants": feat[i].confirmed_per_100k_inhabitants,
						"estimated_population_2019"     : feat[i].estimated_population_2019,
						"order_for_place"               : feat[i].order_for_place,
						"state"                         : feat[i].state,
						"deaths"                        : feat[i].deaths,
						"place_type"                    : feat[i].place_type,
						"date"                          : feat[i].date,
						"death_rate"                    : feat[i].death_rate,
						"is_last"                       : feat[i].is_last
					});
				}

				resp = await getPageData(page++);
			}

			table.appendRows(data);
			doneCallback();
		})();
	};


    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Covid19 - CodeIO"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
