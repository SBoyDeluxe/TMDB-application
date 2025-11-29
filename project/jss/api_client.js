import URLGenerator from './url_generator.js';
import url_generator from './url_generator.js';
/**Exposes the fetching of the api-endpoints
 * 
 */
export class ApiClient {


    static getLanguageParameters() {
        let languageEndpoint = URLGenerator.getLanguageParametersEndpoint();
        let responseFailure = false;
        let languageParameterObjectArray;
        const languageParameterPromise = fetch(languageEndpoint, URLGenerator.options)
            .then((response) => {
                /*Check whether response status code is ok, since the fetch only fails on network errors -> 
                For example 404 is not caught*/
                languageParameterObjectArray = new Array();
                if (response.ok) {
                    return response.json();
                }
                else {

                    throw new Error("Status code: " + response.status + " : " + response.statusText + "\n \t body : " + response.text);


                }
            }).then((json) => {
                console.log(json);
                languageParameterObjectArray = new Array(json.length);
                for (let i = 0; i < json.length; i++) {
                    languageParameterObjectArray[i] = new translationObject(json[i]);

                }
                console.log(languageParameterObjectArray);
                return languageParameterObjectArray;


            }).catch((error) => {

                throw error;
            });
        return languageParameterPromise;




    }

    static getLanguages() {
        let languageEndpoint = URLGenerator.getLanguagesEndpoint();
        let responseFailure = false;
        let languageObjectArray = new Array();
        const languagePromise = fetch(languageEndpoint, URLGenerator.options)
            .then((response) => {
                /*Check whether response status code is ok, since the fetch only fails on network errors -> 
                For example 404 is not caught*/

                if (response.ok) {
                    return response.json();
                }
                else {

                    throw new Error("Status code: " + response.status + " : " + response.statusText + "\n \t body : " + response.text);


                }
            }).then((json) => {
                console.log(json);
                languageObjectArray = new Array(json.length);
                for (let i = 0; i < json.length; i++) {
                    languageObjectArray[i] = new languageObject(json[i].iso_639_1, json[i].english_name, json[i].name);

                }
                return languageObjectArray;


            }).catch((error) => {
                throw error;
            });

        return languagePromise;




    }

    static getCountries() {
        let countryListEndpoint = URLGenerator.getCountriesEndpoint();
        let responseFailure = false;
        let countryObjectArray = new Array();
        const countryPromise = fetch(countryListEndpoint, URLGenerator.options)
            .then((response) => {
                /*Check whether response status code is ok, since the fetch only fails on network errors -> 
                For example 404 is not caught*/

                if (response.ok) {
                    return response.json();
                }
                else {
                    throw new Error("Status code: " + response.status + " : " + response.statusText + "\n \t body : " + response.text);


                }
            }).then((json) => {
                console.log(json);
                countryObjectArray = new Array(json.length);
                for (let i = 0; i < json.length; i++) {
                    countryObjectArray[i] = new countryObject(json[i].iso_3166_1, json[i].english_name, json[i].native_name);

                }

                console.log(countryObjectArray);
                return countryObjectArray;



            }).catch((error) => {
                throw error;
            });
        return countryPromise;

    }

    /**Returns an array of URL-objects, containing endpoints exposing a list of movie genres and tv show genres used in the
    * TMDB api for querying
    * @param {Array<number> | Empty Array} movieGenreIds
    * @param {Array<number>| Empty Array} tvShowGenreIds  
    * @returns Array<Genres> genreArrays = [movieGenres<MovieGenre>, <TvShowGenre>tvShowGenres]
    *           -> when both are given : so that getGenres([1], [23]) would give back
    *               : [movieGenreWithId1, tvShowGenreWithId23];
    * 
    *           -> if only one is given say getGenres([1]. []) = [movieGenreWithId1];
    * 
    *           -> If none are specified all genres for both tables are returned 
    *                : getGenres([],[])[allMovieGenres, allTvShowGenres]  
    */
    static getGenres(movieGenreIds, tvShowGenreIds) {


        /* Generates an array where [0] == movie genre url, [1] == tvShowUrl*/
        let genreEndpoints = URLGenerator.getGenreUrls(movieGenreIds, tvShowGenreIds);

        let movieGenreArray = [];
        let tvShowGenreArray = [];
        if (movieGenreIds ) {
            //We want to get one genre-entity from the genre table per id
            genreEndpoints.forEach((movieGenreEndpoint, index) => {

                movieGenreArray = fetch(movieGenreEndpoint, URLGenerator.options)
                    .then(response => {
                        /*Check whether response status code is ok, since the fetch only fails on network errors -> For example 404 is not caught*/
                        if (response.ok) {
                            return response.json()

                        }
                        else {

                            throw new Error("Status code: " + response.status + " : " + response.statusText + "\n \t body : " + response.text);


                        }
                    }).then((json) => {

                        console.log(json);
                        movieGenreArray[i] = (new MovieGenre(json.id, json.name));
                        /* */


                        console.log(movieGenreArray);

                    }).catch(err => {
                        throw err;
                    });

            });

        }

        //if only tvShowGenreIds are given
        if (tvShowGenreIds) {
            tvShowGenreArray = fetch(genreEndpoints, URLGenerator.options)
                .then(response => {

                    /*Check whether response status code is ok, since the fetch only fails on network errors -> For example 404 is not caught*/
                    if (response.ok) {
                        return res.json()
                    }
                    else {

                        throw new Error("Status code: " + response.status + " : " + response.statusText + "\n \t body : " + response.text);

                    }
                })
                .then((json) => {

                    console.log(json);
                    /*json["genres"] exposes the JSONArray "genres", containing our genre-objects */

                    for (let i = 0; i < json.length; i++) {
                        tvShowGenreArray[i] = (new TvShowGenre(json.id, json.name));


                    }
                    console.log(tvShowGenreArray);


                }).catch(err => {
                    throw err;
                });
        }
        else {

            movieGenreArray = fetch(genreEndpoints[0], URLGenerator.options)
                .then(response => {
                    /*Check whether responseponse status code is ok, since the fetch only fails on network errors -> For example 404 is not caught*/
                    if (response.ok) {
                        return response.json()

                    }
                    else {

                        throw new Error("Status code: " + response.status + " : " + response.statusText + "\n \t body : " + response.text);


                    }
                }).then((json) => {

                    console.log(json);
                    /*json["genres"] exposes the JSONArray "genres", containing our genre-objects */
                    for (let i = 0; i < json["genres"].length; i++) {
                        movieGenreArray[i] = (new MovieGenre(json["genres"][i].id, json["genres"][i].name));
                        /* */

                    }

                    console.log(movieGenreArray);
                    return movieGenreArray;

                }).catch(err => {
                    throw err;
                });

            tvShowGenreArray = fetch(genreEndpoints[1], URLGenerator.options)
                .then(response => {

                    /*Check whether response status code is ok, since the fetch only fails on network errors -> For example 404 is not caught*/
                    if (response.ok) {
                        return response.json()
                    }
                    else {

                        throw new Error("Status code: " + response.status + " : " + response.statusText + "\n \t body : " + response.text);

                    }
                })
                .then((json) => {

                    console.log(json);
                    /*json["genres"] exposes the JSONArray "genres", containing our genre-objects */

                    for (let i = 0; i < json["genres"].length; i++) {
                        tvShowGenreArray[i] = (new TvShowGenre(json["genres"][i].id, json["genres"][i].name));


                    }
                    console.log(tvShowGenreArray);


                }).catch(err => {
                    throw err;
                });

            console.log(movieGenreArray + tvShowGenreArray);
        }
        return Array.from([movieGenreArray, tvShowGenreArray]);





    }

    static getPersonById(personId) {

        let movieEndpointUrl = URLGenerator.getPeopleById(personId);

        const personPromise = fetch(movieEndpointUrl, URLGenerator.options).then((response) => {

            if (response.ok) {

                return response.json();
            }
            else {
                throw new Error("Status code: " + response.status + " : " + response.statusText);
            }
        }).then((json) => new PersonResult(json)).catch((error) => {

            throw error;
        });

        return personPromise;


    }


    static getNetworkById(networkId) {
        let networkUrl = url_generator.getNetworkUrl(networkId);

        const networkPromise = fetch(networkUrl, URLGenerator.options).then((response) => {

            if (response.ok) {
                

                return response.json();
            }
            else {
                throw new Error("Status code: " + response.status + " : " + response.statusText);
            }
        }).then((json) => new Network(json)).catch((error) => {

            throw error;
        });

        return networkPromise;


    }

    static getMovieById(movieId) {

        let movieEndpointUrl = URLGenerator.getMovieEntity(movieId);

        const moviePromise = fetch(movieEndpointUrl, URLGenerator.options).then((response) => {

            if (response.ok) {

                return response.json();
            }
            else {
                throw new Error("Status code: " + response.status + " : " + response.statusText);
            }
        }).then((json) => new MovieResult(json)).catch((error) => {

            throw error;
        });

        return moviePromise;


    }
    /**Gets a tv series json result from the api.
     * 
     * @param {number} showId 
     * @returns {any} json
     */
    static getShowById(showId, overview) {

        let tvShowUrl = URLGenerator.getTvEntity(showId);

        const tvShowPromise = fetch(tvShowUrl, URLGenerator.options).then((response) => {

            if (response.ok) {


                return response.json();
            }
            else {
                throw new Error("Status code: " + response.status + " : " + response.statusText);
            }
        }).then((json) => {
            let result;
            if(json["credits"]){
                             result = new tvSeriesResult(json,  json["credits"]);

            }else{
             result = new tvSeriesResult(json);}
            return result;
        })
            .catch((error) => {

                throw error;
            });

        return tvShowPromise;


    }

    static getTvSeasonsForShowWithCast(showId, numberOfSeasons) {

        const seasonUrl = URLGenerator.getTvSeasosnUrl(showId, numberOfSeasons);


        const seasonsPromise = fetch(seasonUrl, URLGenerator.options).then((response) => {

            if (response.ok) {

                return response.json();
            }
            else {
                throw new Error("Status code: " + response.status + " : " + response.statusText);
            }
        }).then((json) => {

            let seasonArray = new Array(numberOfSeasons);
            //the json coming in will have all season under "/0", "/1"..... It will come with a tvobject since we can only
            // use append to response in a specific namespace, as such we skip the first object in the hierarchy and
            for (let i = 0; i < numberOfSeasons; i++) {
                seasonArray[i] = new Season(json);


            }

            return seasonArray;



        })
            .catch((error) => {

                throw error;
            });

        return seasonsPromise;


    }


    /**Returns the tv list at the endpoint, search result or top rated/popularity based list
     * 
     * @param {string} pathToEndpoint 
     */
    static getTvList(pathToEndpoint) {

        const promise = fetch(url_generator.getTvListUrl(pathToEndpoint), URLGenerator.options).then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {

                throw new Error("Status code: " + response.status + " : " + response.statusText + "\n \t body : " + response.text);


            }
        }).then((json) => {
           let result =  new TvSeriesResultList(json);                 


            return result;

        }).catch((error) => {

            throw error;
        });

        return promise;
    }

    static getPersonList(endpoint) {

        const personListUrl = url_generator.getPersonListUrl(endpoint);
        let result;

        const promise = fetch(personListUrl, url_generator.options).then((response) => {

            if (response.ok) {

                return response.json();
            }
            else {

                throw new Error("Status code: " + response.status + " : " + response.statusText + "\n \t body : " + response.text);

            }

        }).then((json) => {
            let personResultList = new PersonResultList(json);
            console.log(personResultList);

            return personResultList;

        }).catch((error) => { throw error });
        return promise;

    }


    /**Returns the movie list at the endpoint, search result or top rated/popularity based list
     * 
     * @param {string} pathToEndpoint 
     */
    static getMovieList(pathToEndpoint) {


        const promise = fetch(url_generator.getMovieListUrl(pathToEndpoint), URLGenerator.options).then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {

                throw new Error("Status code: " + response.status + " : " + response.statusText + "\n \t body : " + response.text);


            }
        }).then((json) => {
            let result = new MovieResultList(json);

            return result
        }).catch((error) => {

            throw error;
        });

        return promise;
    }
    /** Runs a fetch-operation from the api as an asynchronous function, yielding the thread while awaiting the server-side 
     * response
     * @param {Promise} resultPromise : From one of the static getFunctions of the ApiClient-class
     * 
     */
    static async fetchData(resultPromise) {
        let result;
        try {

            result = await resultPromise;
            return result;


        } catch (error) {
            console.log(error);
        }





    }
}

export class PersonResultList {
    /**
         * @property {number} currentPage representing what page is shown by the list */
    page;
    /**
     * @property {number} totalResults represents the total amount of Person results for some search
     */
    totalResults;
    /**
     * @property {number} totalPages represents the total number of pages available for a specific list 
     */
    totalPages;
    /**
     * @property {Array<PersonResult>} personResults gives us the movie objects for the current page of the search
     */
    personResults;
    /**Takes in the json of a response for a list of movies, such as the endpoint for top rated or popular movies 
     * returns an object representing that list
     * @param {any} json 
     * @returns {Array<PersonResult>} : The MovieResultList-object representing the search and the results on the page specified in the 
     * MovieResultList-object
     */
    constructor(json) {
        this.page = json.page;
        this.totalPages = json.total_pages;
        this.totalResults = json.total_results;


        //known_for -> each secondary top level object contains id, we can then get what they are known for on known for
        let urlArray = new Array(json["results"].length);
        json["results"].forEach((result, index) => {

            urlArray[index] = url_generator.getPeopleById(result.id);


        });
        //Here we got all ids of the actors etc
        let promiseArray = new Array(urlArray.length);
        urlArray.forEach((url, index) => {
            promiseArray[index] = fetch(url, url_generator.options).then((response) => {

                if (response.ok) {

                    return response.json();
                }

                else {
                    throw new Error("Status code: " + response.status + " : " + response.statusText + "\n \t body : " + response.text);

                }

            }).then((personJson) => {
                let personResult = new PersonResult(personJson, json["results"][index]["known_for"]);
                return personResult;
            }).catch((error) => error);

        });



        this.personResults = promiseArray;



        /* .then((json)=>{
                 let personArray = new Array(json.length);
             json.forEach((person, index)=>{
 
                 personArray[index] = new PersonResult(person);
             });
 
             return personArray;
         }).then((personResults) => ).catch((error) => error); */





    }

}

export class PersonResult {
    name;
    placeOfBirth;
    knownFor;
    adultRated;
    alsoKnownAs;
    biography;
    birthday;
    deathday;
    id;
    imdbId;
    imageObject;

    /** [
     *(json)    (property value)
     * 0   -> 	Not set / not specified
       1   -> 	Female
       2   -> 	Male
       3   -> 	Non-binary]
     * @property {string}
     */
    gender;
    popularityObject;
    homePageURL;

    constructor(json, knownForMediaArray) {
        this.name = json.name;
        this.placeOfBirth = json.place_of_birth;
        this.knownFor = { department : json.known_for_department,
            media: knownForMediaArray};
        this.adultRated = json.adult;
        this.alsoKnownAs = json.also_known_as;
        this.biography = json.biography;
        this.birthday = json.birtday;
        this.deathday = json.deathday;
        this.id = json.id;
        this.imdbId = json.imdbid;
        this.imageObject = new ImageObject(json);
        this.gender = PersonResult.assignGender(json);
        this.popularityObject = new PopularityObject(json);
        if (json.homepage) {
            this.homePageURL = new URL(json.homepage);
        }
    }


    /** Converts the integer given in response to a string representing the assigned gender of the person
     * 
     * @param {any} json 
     * @returns {string} gender : As specified in API-documentation
     */
    static assignGender(json) {
        switch (json.gender) {
            case 0: {
                return "Unspecified";
            }

            case 1: {
                return "Female";
            }

            case 2: {
                return "Male";
            }
            case 3: {
                return "Non.binary";
            }

        }
    }
    /**Response body
    object
    adult
    boolean
    Defaults to true
    also_known_as
    array of strings
    biography
    string
    birthday
    string
    deathday
    string
    gender
    integer
    Defaults to 0
    homepage
    string
    id
    integer
    Defaults to 0
    imdb_id
    string
    known_for_department
    string
    name
    string
    place_of_birth
    string
    popularity
    number
    Defaults to 0
    profile_path
    string */

}
/**Represents the popularity based values from response-objects (movie/person/tv-entities) from TMDB
 * 
 * 
 * @property {number} voteCount
 * @property {number} voteAverage  
 * @property {number} popularityScore
 */
export class PopularityObject {
    voteCount;
    voteAverage;
    popularityScore;
    /**
     * 
     *  
     * @param {any} json  
     * 
     */
    constructor(json) {
        this.voteCount = json.vote_count;
        this.voteAverage = json.vote_average;
        this.popularityScore = json.popularity;

    }

}

export class TvSeriesResultList {

    page;
    total_pages;
    total_results;
    results;
    constructor(json) {
        this.page = json.page;
        this.total_pages = json.total_pages;
        this.total_results = json.total_results;
        if (json["results"] && Array.isArray(json["results"])) {

            let resultArray = new Array(json["results"].length);


            json["results"].forEach((showResult, index) => {

                if (showResult) {
                    //Incomplete values are given in normal list, it adheres to the standard in /tv-table
                    // as such we get all show entities directly from table as promises and await these promises
                    //The show result contains the id of the tv-entitiy but not the entire tv-entity.¨
                    //We need to get the tv entity to gain access to the full TvShowResultObject

                    resultArray[index] = ApiClient.getShowById(showResult.id, showResult["overview"]);

                }

                //Await resolution of promises before setting results

                this.results = resultArray;


            });


        }
    }
}

export class tvSeriesResult {
    adultRated;
    imageObject;
    created_by;
    timeObject;
    genres;
    homepage;
    id;
    in_production;
    languages;
    last_episode_to_air;
    name;
    next_episode_to_air;
    networks;
    number_of_episodes;
    number_of_seasons;
    origin_country;
    original_language;
    original_name;
    overview;
    popularityObject;
    imageObject;
    production_companies;
    production_countries;
    seasons;
    spoken_languages;
    currentBroadcastStatus;
    tagline;
    type;
    cast;
    crew;


    constructor(json, jsonCreditsOject) {
        this.adultRated = json.adult;
        this.imageObject = new ImageObject(json);

        if(jsonCreditsOject){
            
       

             let crewArray = new Array( jsonCreditsOject["crew"].length);
            jsonCreditsOject["crew"].forEach((crewMember, index)=>{
                crewArray[index] = new CrewMember(crewMember);

            });
            

            
       this.crew = crewArray;
        


             let castArray = new Array( jsonCreditsOject["cast"].length);
            jsonCreditsOject["cast"].forEach((castMember, index)=>{
                castArray[index] = new CastMember(castMember);

            });
     
            

            
        this.cast = castArray};
    
           
        
        if (json["created_by"] && Array.isArray(json["created_by"])) {
            let promiseArray;
            json["created_by"].forEach((creator, index) => {
                if (index == 0) {
                    promiseArray = new Array(json["created_by"].length);
                }

                promiseArray[index] = ApiClient.getPersonById(creator.id);

                if (index == promiseArray.length - 1) {
                    Promise.resolve(promiseArray).then((results) => {
                        if (results) {
                            this.created_by = results;
                            console.log(results);
                        }

                    }).catch((error) => { throw error });

                }

            });



        };
        this.timeObject = new TvShowTimeObject(json);
        if (json["genre_ids"] && Array.isArray(json["genre_ids"])) {
            let genreArray = ApiClient.getGenres(null, json["genre_ids"]);


            console.log(genreArray);
            this.genres = genreArray;

        }
        else if(json["genres"]){

           let genreArray = new Array( json["genres"].length);
           json["genres"].forEach((genre, index) => {

            genreArray[index] = new TvShowGenre(genre);

            
           });
           //genreArray is complete
           this.genres = genreArray;
        }
        if (json.homepage) {

            this.homepage = json.homepage;
        }
        this.id = json.id;
        this.in_production = json.in_production;
        this.languages = json.languages;
        if (json.name) {
            this.name = json.name;

        }

        if (json["next_episode_to_air"]) {
            this.next_episode_to_air = new Episode(json["next_episode_to_air"]);

        }
        if (json["networks"] && Array.isArray(json["networks"])) {
            let networkArray = new Array(json["networks"].length);
            json["networks"].forEach((network, index) => {

                
                networkArray[index] = ApiClient.getNetworkById(network.id);

            });

                Promise.allSettled(networkArray).then((networks) => {
                                            console.log(networkArray);

                                this.networks = networks;

                }).catch((error)=> {
                    throw error;
                });

        };
        this.number_of_episodes = json.number_of_episodes;
        this.number_of_seasons = json.number_of_seasons;
        this.origin_country = json.origin_country;
        this.original_language = json.original_language;
        this.original_name = json.original_name;
        this.overview = json["overview"];
        this.popularityObject = new PopularityObject(json);
        this.imageObject = new ImageObject(json);
        if (json["production_companies"] && Array.isArray(json["production_companies"])) {
            let companyArray = new Array(json["production_companies"].length);
            json["production_companies"].forEach((productionCompany, index) => {
                companyArray[index] = new ProductionCompany(productionCompany);

            });

            console.log(companyArray);
            this.production_companies = companyArray;

        }
        if (json["production_countries"] && Array.isArray(json["production_countries"])) {
            let prodCountryArray = new Array(json["production_countries"].length);
            json["production_countries"].forEach((prodCountry, index) => {
                prodCountryArray[index] = new countryObject(prodCountry.iso_3166_1, prodCountry.name, "");

            });

            console.log(prodCountryArray);
            this.production_countries = prodCountryArray;

        }
        if (json["number_of_seasons"]) {
             ApiClient.getTvSeasonsForShowWithCast(json.id, json["number_of_seasons"]).then((seasons)=>{
                    this.seasons = seasons;

             });



        }
        if (json["spoken_languages"] && Array.isArray(json["spoken_languages"])) {
            let spokenLanguagesArray = new Array(json["spoken_languages"].length);
            json["spoken_languages"].forEach((language, index) => {
                spokenLanguagesArray[index] = new languageObject(language.iso_639_1, language.english_name, language.name);

            });

            console.log(spokenLanguagesArray);
            this.spoken_languages = spokenLanguagesArray;;

        }
        this.currentBroadcastStatus = json.status;
        this.tagline = json.tagline;
        this.type = json.type;
    


    }
}

export class TvShowTimeObject {
    firstAirDate;
    lastAirDate;
    runtime;

    constructor(json) {

        let object = {
            firstAirDate: json.first_air_date,
            lastAirDate: json.last_air_date,
            runtime: json.runtime
        };

        this.firstAirDate = object.firstAirDate;
        this.lastAirDate = object.lastAirDate;
        this.runtime = this.runtime;
    }

}

export class ProductionCompany {

    id;
    imageObject;
    name;
    origin_country;

    constructor(json) {
        this.id = json.id;
        this.imageObject = new ImageObject(json);
        this.name = json.name;
        this.origin_country = json.origin_country;

    }
}

export class Network {
    headquarters
    homepage
    id
    name
    origin_country
    imageObject;

    constructor(json) {

        this.headquarters = json.headquarters;
        if (json.homepage) {
            this.homepage = new URL(json.homepage);
        }

        this.id = json.id;
        this.name = json.name;
        this.origin_country = json.origin_country;
        this.imageObject = new ImageObject(json);







    }

}

export class Season {



    air_date;
    episodes;
    name;
    overview;
    id;
    imageObject;
    season_number;
    vote_average;


    constructor(json) {

        this.air_date = json.air_date;

        if (json && Array.isArray(json["episodes"])) {
            let episodeArray = new Array(json["episodes"].length);
            json["episodes"].forEach((episode, index) => {
                episodeArray[index] = new Episode(episode);

            });

            console.log(episodeArray);
            this.episodes = episodeArray;

        }

        this.name = json.name;
        this.overview = json.overview;
        this.id = json.id;
        this.imageObject = new ImageObject(json);
        this.season_number = json.season_number;

        this.vote_average = json.vote_average;




    }
}


 export class Episode {
    name;
    id;
    production_code;
    season_number;
    imageObject;
    popularityObject;
    timeObject;
    guestStars;
    crew;
    cast;

    constructor(json) {


        this.name = (json.name) ? json.name : "";
        this.id = json.id;
        this.production_code = json.production_code;
        this.season_number = json.season_number;
        this.imageObject = new ImageObject(json);
        this.popularityObject = new PopularityObject(json);
        this.timeObject = {
            airDate: json.air_date,
            runtime: json.runtime
        };

        const jsonCrewArray = json["crew"];
        if (jsonCrewArray && Array.isArray(jsonCrewArray)) {
            let crewArray = new Array(jsonCrewArray.length);

            for (let i = 0; i < jsonCrewArray.length; i++) {

                crewArray[i] = new CrewMember(jsonCrewArray[i]);
            }
            console.log(crewArray);
            this.crew = crewArray;
        }

        const guestStarJsonArray = json["guest_stars"];
        if (guestStarJsonArray && Array.isArray(guestStarJsonArray)) {
            let guestStarArray = new Array(guestStarJsonArray.length);

            for (let i = 0; i < guestStarJsonArray
                .length; i++) {

                guestStarArray[i] = new GuestStar(guestStarJsonArray
                [i]);
            }
            console.log(guestStarArray);
            this.guestStars = guestStarArray;
        }
        const castJsonArray = json["cast"];
        if (castJsonArray && Array.isArray(castJsonArray)) {
            let castArray = new Array(castJsonArray.length);

            for (let i = 0; i < castJsonArray
                .length; i++) {

                castArray[i] = new CastMember(castJsonArray
                [i]);
            }
            console.log(castArray);
            this.cast = castArray;
        }


    }



}

class CastMember extends PersonResult {

    character;

    constructor(json) {
        super(json);
        this.character = json.character;
    }
}

export class CrewMember extends PersonResult {
    department;
    job;

    constructor(json) {
        super(json);
        this.department = json.department;
        this.job = json.job;

    }


}

export class GuestStar extends CastMember {

    constructor(json) {

        super(json);
    }




}

export class MovieResultList {
    /**
     * @property {number} currentPage representing what page is shown by the list */
    page;
    /**
     * @property {number} totalResults represents the total amount of movie results for some search
     */
    totalResults;
    /**
     * @property {number} totalPages represents the total number of pages available for a specific list 
     */
    totalPages;
    /**
     * @property {Array<MovieResult>} MovieResults gives us the movie objects for the current page of the search
     */
    movieResults;
    /**Takes in the json of a response for a list of movies, such as the endpoint for top rated or popular movies 
     * returns an object representing that list
     * @param {any} json 
     * @returns {MovieResultList} : The MovieResultList-object representing the search and the results on the page specified in the 
     * MovieResultList-object
     */
    constructor(json) {

        this.page = json.page;
        this.totalPages = json.total_pages;
        this.totalResults = json.total_results;
        let MovieResultsJson = json["results"];
        let tempMovieResultList;
        let returnList;
        if (Array.isArray(MovieResultsJson)) {
            //create array to store MovieResults in. 
            tempMovieResultList = new Array(MovieResultsJson.length);
            for (let i = 0; i < MovieResultsJson.length; i++) {
                tempMovieResultList[i] = ApiClient.fetchData(ApiClient.getMovieById(MovieResultsJson[i].id));

            }
            returnList = tempMovieResultList;
        }


        this.movieResults = returnList;
        console.log(this);
        return this;
    }



}
/**A movie result should show a title, a picture and a release date.
 * 
 */
export class MovieResult {
    /**example movie response{
    "adult": false,
    "backdrop_path": "/2u7zbn8EudG6kLlBzUYqP8RyFU4.jpg",
    "belongs_to_collection": {
        "id": 119,
        "name": "The Lord of the Rings Collection",
        "poster_path": "/oENY593nKRVL2PnxXsMtlh8izb4.jpg",
        "backdrop_path": "/bccR2CGTWVVSZAG0yqmy3DIvhTX.jpg"
    },
    "budget": 94000000,
    "genres": [
        {
            "id": 12,
            "name": "Adventure"
        },
        {
            "id": 14,
            "name": "Fantasy"
        },
        {
            "id": 28,
            "name": "Action"
        }
    ],
    "homepage": "http://www.lordoftherings.net",
    "id": 122,
    "imdb_id": "tt0167260",
    "origin_country": [
        "US"
    ],
    "original_language": "en",
    "original_title": "The Lord of the Rings: The Return of the King",
    "overview": "As armies mass for a final battle that will decide the fate of the world--and powerful, ancient forces of Light and Dark compete to determine the outcome--one member of the Fellowship of the Ring is revealed as the noble heir to the throne of the Kings of Men. Yet, the sole hope for triumph over evil lies with a brave hobbit, Frodo, who, accompanied by his loyal friend Sam and the hideous, wretched Gollum, ventures deep into the very dark heart of Mordor on his seemingly impossible quest to destroy the Ring of Power.​",
    "popularity": 22.8526,
    "poster_path": "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    "production_companies": [
        {
            "id": 12,
            "logo_path": "/2ycs64eqV5rqKYHyQK0GVoKGvfX.png",
            "name": "New Line Cinema",
            "origin_country": "US"

        },
        {
            "id": 11,
            "logo_path": "/6FAuASQHybRkZUk08p9PzSs9ezM.png",
            "name": "WingNut Films",
            "origin_country": "NZ"
        },
        {
            "id": 5237,
            "logo_path": "/mlnr7vsBHvLye8oEb5A76C0t8x9.png",
            "name": "The Saul Zaentz Company",
            "origin_country": "US"
        }
    ],
    "production_countries": [
        {
            "iso_3166_1": "NZ",
            "name": "New Zealand"
        },
        {
            "iso_3166_1": "US",
            "name": "United States of America"
        }
    ],
    "release_date": "2003-12-17",
    "revenue": 1118888979,
    "runtime": 201,
    "spoken_languages": [
        {
            "english_name": "English",
            "iso_639_1": "en",
            "name": "English"
        }
    ],
    "status": "Released",
    "tagline": "There can be no triumph without loss. No victory without suffering. No freedom without sacrifice.",
    "title": "The Lord of the Rings: The Return of the King",
    "video": false,
    "vote_average": 8.483,
    "vote_count": 25036
} */
    adultRated;
    title;
    imageObject;
    popularityObject;
    movieTimeObject;
    tagline;
    overview;
    collectionObjectArray;
    movieGenreArray;
    movieEconomy;
    originalTitle;
    movieId;
    movieLanguageObject;


    /**
     * 
     * @param {string} title 
     * @param {string} originalTitle 
     * @param {boolean} adultRated 
     * @param {Array<CollectionObject>} collectionObjectArray 
     * @param {ImageObject} imageObject 
     * @param {MovieTimeObject} movieTimeObject 
     * @param {MovieEconomy} movieEconomy 
     * @param {Array<MovieGenre>} movieGenreArray 
     * @param {MovieLanguageObject} movieLanguageObject
     * @param {PopularityObject} popularityObject
     * @param {string} tagline 
     * @param {string} overview 
     * @param {number} movieId 
     * 
     */
    /* constructor(title, originalTitle, movieId, adultRated, collectionObjectArray ,imageObject , movieTimeObject, movieEconomy, movieGenreArray, movieLanguageObject
        , voteAverage, voteCount, tagline, overview){
                this.title = title;
                this.originalTitle = originalTitle;
                this.movieId = movieId;
                this.voteAverage = voteAverage;
                this.voteCount = voteCount;
                this.tagline = tagline;
                this.overview = overview;
                this.collectionObjectArray = collectionObjectArray;
                this.adultRated = adultRated;
                this.imageObject = imageObject;
                this.movieTimeObject = movieTimeObject;
                this.movieEconomy = movieEconomy;
                this.movieGenreArray = movieGenreArray;
                this.movieLanguageObject = movieLanguageObject;


*/
    //}
    /**
     * 
     * @param {any} json 
     */
    constructor(json) {
        this.adultRated = json.adult;
        this.title = json.title;
        this.originalTitle = json.original_title;
        this.overview = json.overview;
        this.tagline = json.tagline;
        this.popularityObject = new PopularityObject(json);
        this.movieId = json.id;

        //Get collection array
        const collectionObjectArrayJson = (json["belongs_to_collection"] == null || json["belongs_to_collection"] == undefined) ? Array.of(null) : json["belongs_to_collection"];
        if (Array.isArray(collectionObjectArrayJson) && !collectionObjectArrayJson.includes(null)) {
            tempCollectionObjectArray = new Array < CollectionObject > (collectionObjectArrayJson.length);
            let counter = 0;
            for (const collectionObject of collectionObjectArrayJson) {
                tempCollectionObjectArray[counter] = new CollectionObject(collectionObject.id, collectionObject.name,
                    new ImageObject(json));
            }
            //We have now collected all collectionObjects
            this.collectionObjectArray = tempCollectionObjectArray;


        }

        this.imageObject = new ImageObject(json);

        this.movieEconomy = new MovieEconomy(json.budget, json.revenue);
        if (Array.isArray(json["genres"])) {

            let tempGenreArray = new Array(json["genres"].length);
            for (let i = 0; i < tempGenreArray.length; i++) {
                tempGenreArray[i] = new MovieGenre(json["genres"][i].id, json["genres"][i].name);

            }

            this.movieGenreArray = tempGenreArray;



        }

        if (Array.isArray(json["spoken_languages"])) {

            /**"english_name": "English",
            "iso_639_1": "en",
            "name": "English" */
            let tempLanguageObjectArray = Array(json["spoken_languages"].length);
            for (let i = 0; i < tempLanguageObjectArray.length; i++) {
                tempLanguageObjectArray[i] = new languageObject(json["spoken_languages"][i].iso_639_1, json["spoken_languages"][i].english_name, json["spoken_languages"][i].name);

            }

            this.movieLanguageObject = new MovieLanguageObject(json.original_language, tempLanguageObjectArray)
            this.movieTimeObject = new MovieTimeObject(json.release_date, json.runtime, json.status);
        }
    }

    getImages() {
        if (this.imageObject != null || this.imageObject != undefined && this.imageObject.instanceof(ImageObject)) {
            let imageUrlArray;
            for (let i = 0; i < 5; i++) {
                if (this.imageObject.pathArray[i] != null || this.imageObject.pathArray[i] != undefined) {

                    console.log(url_generator.getImageUrls(i, this.imageObject.pathArray[i]));


                }

            }


        }

    }
}

export class MovieLanguageObject {

    originalLanguage;
    spokenLanguagesArray;
    /**
     * 
     * @param {string} originalLanguage 
     * @param {Array<languageObject>} spokenLanguagesArray 
     */
    constructor(originalLanguage, spokenLanguagesArray) {
        this.originalLanguage = originalLanguage;
        this.spokenLanguagesArray = spokenLanguagesArray;

    }


}

export class CollectionObject {
    id;
    name;
    imageObject;
    /**
     * 
     * @param {number} id 
     * @param {string} name 
     * @param {ImageObject} imageObject 
     */
    constructor(id, name, imageObject) {
        this.id = id;
        this.name = name;
        this.imageObject = imageObject;

    }

}

export class ImageObject {
    pathArray;
    /**
     * 
     * @param {Array<string>} pathArray ; index of path [ static IMAGE_BACKDROP = 0,
     *   static IMAGE_POSTER = 1,
     *   static IMAGE_PROFILE = 2,
     *   static IMAGE_STILL = 3,
     *   static IMAGE_LOGO = 4,] -> So that index informs ImageType 
     * 
     * @property {Array<string>} pathArray ; ["","","","",""] -> If a certain pathway exists for an image the index of the collection
     *  will have an element, otherwise it will be an empty string (so it can be checked for with if-statement on the elements of the array)
     */
    constructor(json) {
        let pathArray = ["", "", "", "", ""];
        if (json.backdrop_path) {
            pathArray[0] = url_generator.getImageUrls(0, json.backdrop_path);

        }
        if (json.poster_path) {
            pathArray[1] = url_generator.getImageUrls(1, json.poster_path);


        }
        if (json.profile_path) {
            pathArray[2] = url_generator.getImageUrls(2, json.profile_path);


        }
        if (json.still_path) {
            pathArray[3] = url_generator.getImageUrls(3, json.still_path);


        }
        if (json.logo_path) {
            pathArray[4] = url_generator.getImageUrls(4, json.logo_path);


        }
        this.pathArray = pathArray;
    }

}

export class MovieTimeObject {
    releaseDate;
    runtime;
    releaseStatus;
    /**
     * 
     * @param {string} releaseDate 
     * @param {number} runtime in minutes 
     * @param {string} releaseStatus 
     */
    constructor(releaseDate, runtime, releaseStatus) {
        this.releaseDate = releaseDate;
        this.runtime = runtime;
        this.releaseStatus = releaseStatus;

    }
}

export class MovieEconomy {
    budget;
    revenue;
    profit;
    /**
     * 
     * @param {number} budget 
     * @param {number} revenue 
     */
    constructor(budget, revenue) {
        this.budget = budget;
        this.revenue = revenue;
        this.profit = revenue - budget;

    }


}
/**Creates a genre object. indicating the genres used in the database
 * 
 */
export class Genre {
    genreId;
    genreName;
    /**
     * 
     * @param {number} id 
     * @param {string} name 
     */
    constructor(id, name) {
        this.genreId = id;
        this.genreName = name;

    }



}
/**Semantic class denoting movie-genres, for use in conjunction with filtering on movie-endpoints
 * 
 */
export class MovieGenre extends Genre {
    /**
     * 
     * @param {number} id 
     * @param {string} name 
     */
    constructor(id, name) {
        super(id, name);

    }
}


/**Semantic class denoting tv-show-genres, for use in conjunction with filtering on tv show-endpoints
 * 
 */
export class TvShowGenre extends Genre {
    /**
     * 
     * @param {number} id 
     * @param {string} name 
     */
    constructor(json) {
        super(json.id, json.name);

    }
}


export class languageObject {
    /**The iso-639-1 code of the language, used for showing languages of database queries -> For example, german films would have
     * a german language code
     ** */
    iso6391Code;
    /**The english name of the language
     * 
     */
    englishName;
    /**The native naming of the language
     * 
     */
    name;
    /**
     * 
     * @param {string} iso6391Code 
     * @param {string} englishName 
     * @param {string} name 
     */
    constructor(iso6391Code, englishName, name) {
        this.iso6391Code = iso6391Code;
        this.englishName = englishName;
        this.name = name;

    }



}

/**Object used to designate countries, for result lists 
 * 
 */
export class countryObject {
    /**
     * example: {
    *"iso_3166_1": "AF",
    *"english_name": "Afghanistan",
    *"native_name": "Afghanistan"
     *   },
     * 
     */

    iso_3166_1;
    englishName;
    nativeName;
    /**
     * 
     * @param {string} iso_3166_1 
     * @param {string} englishName 
     * @param {string} nativeName 
     */
    constructor(iso_3166_1, englishName, nativeName) {
        this.iso_3166_1 = iso_3166_1;
        this.nativeName = nativeName;
        this.englishName = englishName;

    }




}

export class translationObject {
    /**Can be used to get translations of TMDB, defaulting for example german posters if german is selected etc.
     * 
     */
    languageParameter;
    /**
     * 
     * @param {string} languageParameter 
     */
    constructor(languageParameter) {
        this.languageParameter = languageParameter;
    }
}
/**This class represents an amalgamation of a CountryObject, a TranslationObject and a LanguageObject all referring
 * to a specific country, its languages and the language-parameter that maps to the translation of the page @argument{translationObject}. 
 * 
 * -> This class should be discerned from the languageObjects, where the languageObject refers to the iso-code, english name and native name
 * of one specific language, the @class{languageSelectionObject} represents the data needed to generate a list for language selection for the 
 * user.
 * 
 */
export class languageSelectionObject {
    country;
    languageParameter;
    languageObject;

    constructor(countryIn, languageParameter, languageObjectIn) {
        this.country = countryIn;
        this.languageObject = languageObjectIn;
        this.languageParameter = languageParameter;

    }
    /**Generates a selection with native naming, countries and languageParameters for user-selection of countries.
     * 
     * @param {Array<languageObject>} languageObjectArray 
     * @param {Array<countryObject>} countryObjectArray 
     * @param {Array<translationObject>} translationObjectArray 
     */
    static createLanguageSelectionObjectArray(languageObjectArray, countryObjectArray, translationObjectArray) {
        //We only have as many languageSelections for the page as there is translationsObjects in total
        if (Array.isArray(languageObjectArray) && Array.isArray(countryObjectArray) && Array.isArray(translationObjectArray)) {
            let languageSelectionObjectArray = new Array(translationObjectArray.length);
            //Sort alphabetically to easier find matcher
            languageObjectArray.sort();
            countryObjectArray.sort();

            for (let i = 0; i < translationObjectArray.length; i++) {
                let tempCounter = 0;
                while (!translationObjectArray[i].languageParameter.toString().includes(languageObjectArray[tempCounter].iso6391Code)) {
                    tempCounter++;
                }
                //Upon completion of while loop we have found a language that matches the translation string
                let tempLanguageObject = languageObjectArray[tempCounter];
                //Reset counter so we start going from the top
                tempCounter = 0;
                while (!(translationObjectArray[i].languageParameter.toString().includes(countryObjectArray[tempCounter].iso_3166_1)) && (tempCounter < countryObjectArray.length)) {   //(length -1) = index of last element
                    if (tempCounter < countryObjectArray.length - 1) {
                        tempCounter++;
                    }
                    else { break; }



                }
                let tempCountryObject;
                if (tempCounter == countryObjectArray.length) {
                    tempCountryObject = new countryObject("", "", "");
                } else {
                    tempCountryObject = countryObjectArray[tempCounter];
                }
                //There should be precisely as many pairings as there is translation-objects, as such, per for-loop one pairing should always be found and we
                //should not have to check for null values. 

                languageSelectionObjectArray[i] = new languageSelectionObject(tempCountryObject, translationObjectArray[i], tempLanguageObject);

            }

            //Once loop is for-loop is completed we have all available LanguageSelectionObjects in the array
            languageSelectionObjectArray = languageSelectionObjectArray.sort((elementA, elementB) => {
                /*Both of these elements will be written in same format, so we don´t have to call .toLowerCase*/
                const countryNameA = elementA.country.englishName;
                const countryNameB = elementB.country.englishName;
                return countryNameA.localeCompare(countryNameB);








            });

            console.log(languageSelectionObjectArray);

            return languageSelectionObjectArray;

        }


    }

}




