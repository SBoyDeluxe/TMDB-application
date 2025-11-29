
export default class URLGenerator {
    static pageVariables = { languageParameter : "en-US",
        nextPageCount : +0,
        nextPageBool :  (URLGenerator.nextPageCount >= +20),
        pageNumber : +1

    }
 

    
  
    /**Sets page number and pageCount (number of results shown) to 1 and 0
     *  -> Done on getting of each new list (select_list event(change)) and selection of new
     *  type of result(Any tab is clicked )
     * 
     */
    static resetElementCountAndPageNUmber() {

        URLGenerator.pageVariables.pageNumber = +1;
        URLGenerator.pageVariables.nextPageCount = +0;
    }

    static addToNumberOfShownResults(numberOfElements){
        let sum  = +URLGenerator.pageVariables.nextPageCount + +numberOfElements;

        URLGenerator.pageVariables.nextPageCount = +sum;
    }






    /*The following static ints are used to declare in getImageUrlss whether we are specifying a poster, backdrop, profile or still
     -> These all have different image size-paths and as such the collection of these endpoints for the image-table must be selected accordingly*/
    static IMAGE_BACKDROP = 0;
    static IMAGE_POSTER = 1;
    static IMAGE_PROFILE = 2;
    static IMAGE_STILL = 3;
    static IMAGE_LOGO = 4;

    static options = {
        method: 'GET',
        credentials : `omit`,
        "Access-Control-Allow-Origin" : "https://127.0.0.1:5500'",
        "Vary": "Origin",


        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZmE2MTU5NWQ4ZTczY2EyMTFkM2E1OGMxYzM4MjBjNSIsIm5iZiI6MTc0NjIyNzkyNC4zMDIsInN1YiI6IjY4MTU1MmQ0N2EzODY2YjM2YTAzMGNlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aGRt22WqqAJ3mtbNAxhHEuTzRSFOt5vfDgu8M7e_ZlQ' ,
            "Cache-Control" : "no-cache",

        
           
        }
    };

    static baseUrlTMDB = "https://api.themoviedb.org/3";
    static httpBaseUrlTmdb = "https://api.themoviedb.org/3"

    static tableEndpoints = {
        movies: '/movie',
        person: '/person',
        tvShows: {
            base: '/tv',
            season: "/season",
            episode: "/episode"
        },
        /**
       * Number of votes for the day
       * Number of views for the day
       * Number of users who marked it as a "favourite" for the day
       * Number of users who added it to their "watchlist" for the day
       * Next/last episode to air date
       * Number of total votes
       * Previous days score
       */
        popularTvShows: "/tv/popular",
            /**    Trending:
            *
            *        -Trending is another type of "popularity" score on TMDB but unlike popularity (discussed above), trending's time windows are much shorter (daily, weekly). This helps us surface the relevant content of today (the new stuff) much easier.
            *
            *        -Just like popularity, we track trending scores for movies, TV shows and people.
            * */
        trending: {

            movies: "/trending/movie",

            people: "/trending/person",

            tvShows: "/trending/tv"
        },
        /**Factors : 
         *           Number of votes for the day
         *           Number of views for the day
         *           Number of users who marked it as a "favourite" for the day
         *           Number of users who added it to their "watchlist" for the day
         *           Release date
         *           Number of total votes
         *           Previous days score
         * 
         */
        popularMovies: "/movie/popular",
        /**
           * Number of views for the day
           * Previous days score
           */
        popularPeople: "/person/popular",
        topRatedMovies: '/movie/top_rated',
        topRatedTvShows: '/tv/top_rated',
        genreMovies: "/genre/movie/list",
        genreTvShows: "/genre/tv/list",
        languagesIsoCodes: "/configuration/languages",
        primaryTranslations: "/configuration/primary_translations",
        countries: "/configuration/countries",
        networks: "/network",
        imagesBaseUrl: "https://image.tmdb.org/t/p"
    };
    static queryParameters = {
        /*For use with images, construct image-url via tableEndPoints.images + "/"+imageSize+ "/"+ imagepathAsJsonAttribute */
        imageQueryParamters: {
            imageSize: "",
            imagepathAsJsonAttribute: ""

        },
        personSearchParameters: {
            //designates query, for name or also_known_as from person-table
            query: null,
            /*Whether or not to include adult-rated results*/
            include_adult: false,
            //sets the language query parameter to the set language-translation of the site as got by PrimaryTranslations
            language: URLGenerator.pageVariables.languageParameter,
            //Signifies what page to get from result pages, must be < total_pages of response if one exists
            page: 1,
        },
        /* 
          Search for movie by title. original (First name : The tonight show), translated (region specific, in japanese for example) and alternative (tonight show with... , later iterations ) 
          (query
          string
          required)
          include_adult
          boolean
          Defaults to false
      
          false
          language
          string
          Defaults to en-US
          en-US
          primary_release_year
          string
          page
          int32
          Defaults to 1
          1
          region
          string
          year
          string*/
        movieSearchParameters: {

            //designates query, for title
            query: null,
            /*Whether or not to include adult-rated results*/
            include_adult: false,
            //sets the language query parameter to the set language-translation of the site as got by PrimaryTranslations
            language: URLGenerator.pageVariables.languageParameter,
            //Designates the earliest theatrical release of the movie (primary as in first)
            primary_release_year: null,
            //Signifies what page to get from result pages, must be < total_pages of response if one exists
            page: 1,
            //As known from countries, implicitly set to the region specified by the language ISO-code. Can be chosen from list via getCountries
            region: null,
            //Year of release not filtered on primary release, say some movie is 2015 in Europe and 2 years later in China, then it would still appear if year is 
            //set to 2017
            year: null


        },
        /*Query Params
    query
    string
    required
    first_air_date_year
    int32
    Search only the first air date. Valid values are: 1000..9999
    
    include_adult
    boolean
    Defaults to false
    
    false
    language
    string
    Defaults to en-US
    en-US
    page
    int32
    Defaults to 1
    1
    year
    int32
    Search the first air date and all episode air dates. Valid values are: 1000..9999*/
        tvShowParameters: {

            //designates query, for title
            query: null,
            /*Whether or not to include adult-rated results*/
            include_adult: false,
            //sets the language query parameter to the set language-translation of the site as got by PrimaryTranslations
            language: URLGenerator.pageVariables.languageParameter,
            //Designates the earliest theatrical release of the movie (primary as in first)
            first_air_date_year: null,
            //Signifies what page to get from result pages, must be < total_pages of response if one exists
            page: 1,
            //Year of release not filtered on primary release, so both for first_air_date as well as the air date of any given aired episode
            year: null

        }
    }
    /** Generates complete url-collection for sourceset in picture-element
     * 
     * @param {int} STATIC_IMAGE_INT ; 0<= int <=4,  found in URLGenerator.<Image-type-wanted> as a static property
     * @param {string} pathAsJsonAttribute ; pathAsJsonAttribute is the pathAsJsonAttribute to the image from a API-response
     * @returns {string>} : url.href as string
     */
    static getImageUrls(STATIC_IMAGE_INT, pathAsJsonAttribute) {
        switch (STATIC_IMAGE_INT) {
            /*Indicates  image is backdrop, we return a list of all available endpoints for end use in <picture>-element*/
            case 0: {
                let backdrop_sizes = [
                    "w300",
                    "w780",
                    "w1280",
                ];
                let urlReturnList = new Array(backdrop_sizes.length);
                for (let i = 0; i < backdrop_sizes.length; i++) {
                    urlReturnList[i] = URLGenerator.tableEndpoints.imagesBaseUrl + "/" + backdrop_sizes[i] + pathAsJsonAttribute;

                }
                return urlReturnList;
            }

            case 1: {
                let poster_sizes = [
                    "w92",
                    "w154",
                    "w185",
                    "w342",
                    "w500",
                    "w780",
                ];
                let urlReturnList = new Array(poster_sizes.length);
                for (let i = 0; i < poster_sizes.length; i++) {
                    urlReturnList[i] = URLGenerator.tableEndpoints.imagesBaseUrl + "/" + poster_sizes[i] + pathAsJsonAttribute;

                }
                return urlReturnList;
            }

            case 2: {
                let profile_sizes = [
                    "w45",
                    "w185",
                    "h632",
                ];
                let urlReturnList = new Array(profile_sizes.length);
                for (let i = 0; i < profile_sizes.length; i++) {
                    urlReturnList[i] = URLGenerator.tableEndpoints.imagesBaseUrl + "/" + profile_sizes[i] + pathAsJsonAttribute;

                }
                return urlReturnList;
            }
            case 3: {
                let still_sizes = [
                    "w92",
                    "w185",
                    "w300",
                ];
                let urlReturnList = new Array(still_sizes.length);
                for (let i = 0; i < still_sizes.length; i++) {
                    urlReturnList[i] = URLGenerator.tableEndpoints.imagesBaseUrl + "/" + still_sizes[i] + pathAsJsonAttribute;

                }
                return urlReturnList;
            }

            /**     "w45",
                "w92",
                "w154",
                "w185",
                "w300",
                "w500",
                "original" */
            case 4: {
                let logo_sizes = [
                    "w45",
                    "w92",
                    "w154",
                    "w185",
                    "w300",
                    "w500",
                ];
                let urlReturnList = new Array(logo_sizes.length);
                for (let i = 0; i < logo_sizes.length; i++) {
                    urlReturnList[i] = URLGenerator.tableEndpoints.imagesBaseUrl + "/" + logo_sizes[i] + pathAsJsonAttribute;

                }
                return urlReturnList;
            }
            default: return null;
        }



    }
    /**
     * 
     * @param {int} STATIC_IMAGE_INT 
     * @returns {Array<string>} mediaAttributeForImageType: returns an array of strings, in the following manner : 
     *          [
                         "(min-width:45px)",
                          "(min-width:92px)",
                           "(min-width:154px)",
                            "(min-width:185px)",
                            "(min-width:300px)",
                            "(min-width:500px)"
            
                ]
    
                -> for use with source-Element
                
     */
    static getWidthArrayForImageType(STATIC_IMAGE_INT) {
        switch (STATIC_IMAGE_INT) {
            /*Indicates  image is backdrop*/
            case 0: {

                return ["(min-width:300px)",
                    "(min-width:700px)",
                    "(min-width:1200px)"
                ];
            }


            case 1: {
                return [
                    "(min-width:92px)",
                    "(min-width:154px)",
                    "(min-width:185px)",
                    "(min-width:342px)",
                    "(min-width:500px)",
                    "(min-width:780px)"
                ];

            }

            case 2: {
                return [

                    "(min-width:45px)",

                    "(min-width:185px)",

                    "(min-height:635px)"
                ];

            }
            case 3: {
                return [
                    "(min-width:92px)",

                    "(min-width:185px)",

                    "(min-width:300px)",


                ];

            }

            /**     "w45",
                "w92",
                "w154",
                "w185",
                "w300",
                "w500",
                "original" */
            case 4: {
                return [
                    "(min-width:45px)",
                    "(min-width:92px)",
                    "(min-width:154px)",
                    "(min-width:185px)",
                    "(min-width:300px)",
                    "(min-width:500px)"

                ];


            }
            default: return null;
        }


    }
    /** Dynamically returns all the relevant urls for a specific image type from the response
     *  JSON-attribute
     * 
     * @param {string} pathAsJsonAttribute 
     * @returns {Array<string>} pathArray of complete urls as strings
     */
    static getImageUrlFromJson(pathAsJsonAttribute) {
        switch (pathAsJsonAttribute) {
            /*Indicates  image is backdrop, we return a list of all available endpoints for end use in <picture>-element*/
            case "backdrop_path": {
                let backdrop_sizes = [
                    "w300",
                    "w780",
                    "w1280",
                ];
                let urlReturnList = new Array(backdrop_sizes.length);
                for (let i = 0; i < backdrop_sizes.length; i++) {
                    urlReturnList[i] = URLGenerator.tableEndpoints.imagesBaseUrl + "/" + backdrop_sizes[i] + pathAsJsonAttribute;

                }
                return urlReturnList;
            }

            case "poster_path": {
                let poster_sizes = [
                    "w92",
                    "w154",
                    "w185",
                    "w342",
                    "w500",
                    "w780",
                ];
                let urlReturnList = new Array(poster_sizes.length);
                for (let i = 0; i < poster_sizes.length; i++) {
                    urlReturnList[i] = URLGenerator.tableEndpoints.imagesBaseUrl + "/" + poster_sizes[i] + pathAsJsonAttribute;

                }
                return urlReturnList;
            }

            case "profile_path": {
                let profile_sizes = [
                    "w45",
                    "w185",
                    "h632",
                ];
                let urlReturnList = new Array(profile_sizes.length);
                for (i = 0; i < backdrop_sizes.length; i++) {
                    urlReturnList[i] = URLGenerator.tableEndpoints.imagesBaseUrl + "/" + profile_sizes[i] + pathAsJsonAttribute;

                }
                return urlReturnList;
            }
            case "logo_path": {
                let still_sizes = [
                    "w92",
                    "w185",
                    "w300",
                ];
                let urlReturnList = new Array(still_sizes.length);
                for (let i = 0; i < still_sizes.length; i++) {
                    urlReturnList[i] = URLGenerator.tableEndpoints.imagesBaseUrl + "/" + still_sizes[i] + pathAsJsonAttribute;

                }
                return urlReturnList;
            }

            /**     "w45",
                "w92",
                "w154",
                "w185",
                "w300",
                "w500",
                "original" */
            case "still_path": {
                let logo_sizes = [
                    "w45",
                    "w92",
                    "w154",
                    "w185",
                    "w300",
                    "w500",
                ];
                let urlReturnList = new Array(logo_sizes.length);
                for (let i = 0; i < logo_sizes.length; i++) {
                    urlReturnList[i] = URLGenerator.tableEndpoints.imagesBaseUrl + "/" + still_sizes[i] + pathAsJsonAttribute;

                }
                return urlReturnList;
            }
            default: return null;
        }

    }
    /**Called when nextPageCount == 20, since that means we have shown 20 results (max of one page)
     * 
     * @param {tableEndpoint} endpoint 
     * @returns {URL} newUrl
     */
    static getNextPageOfList(tableEndpoint) {
        // increase pageNumber 
        URLGenerator.pageVariables.pageNumber += 1;
        let returnUrl = new URL(URLGenerator.baseUrlTMDB + tableEndpoint + "?language=" + URLGenerator.pageVariables.languageParameter
            + "&page=" + URLGenerator.pageVariables.pageNumber);
        //Since we´re calling nextPage -> pageCount>= 20, it should be reset
        URLGenerator.pageVariables.nextPageCount = 0;
        return returnUrl;


    }

    /** Gets the next page if pageVariables.nextPageBool == true. in that case it also increases pageNumber by one
     * 
     * @param {URLGenerator.tableEndpoint} endpoint 
     * @returns 
     */
    static getTvListUrl(endpoint) {
        //if pageCountBool, that means we should change page
        if (URLGenerator.pageVariables.nextPageCount >= 20) {
            return URLGenerator.getNextPageOfList(endpoint);
        }   else {

            if (!endpoint.includes("?")) {
                return new URL(URLGenerator.baseUrlTMDB + endpoint + "?language=" + URLGenerator.pageVariables.languageParameter + "&page=" + URLGenerator.pageVariables.pageNumber);
            }
            
            else if(URLGenerator.pageVariables.pageNumber == 0 && (!endpoint.includes("?"))) {
                return new URL(URLGenerator.baseUrlTMDB + endpoint + "?language=" + URLGenerator.pageVariables.languageParameter + "&page=1");

            }
            else{
                                    return new URL(URLGenerator.baseUrlTMDB + endpoint + "&language=" + URLGenerator.pageVariables.languageParameter + "&page=" + URLGenerator.pageVariables.pageNumber);


            }
        }
    }

    static getNetworkUrl(networkId) {
        let networkEndpoint = URLGenerator.baseUrlTMDB + URLGenerator.tableEndpoints.networks + "/" + networkId + "?language=" + URLGenerator.pageVariables.languageParameter;

        return new URL(networkEndpoint);

    }

    static getMovieListUrl(endpoint) {

        if (URLGenerator.pageVariables.nextPageCount >= 20) {

            return URLGenerator.getNextPageOfList(endpoint);
        }
        else {

            if (!endpoint.includes("?")) {
                return new URL(URLGenerator.baseUrlTMDB + endpoint + "?language=" + URLGenerator.pageVariables.languageParameter + "&page=" + URLGenerator.pageVariables.pageNumber);
            }
            
            else if(URLGenerator.pageVariables.pageNumber == 0 && (!endpoint.includes("?"))) {
                return new URL(URLGenerator.baseUrlTMDB + endpoint + "?language=" + URLGenerator.pageVariables.languageParameter + "&page=1");

            }
            else{
                                    return new URL(URLGenerator.baseUrlTMDB + endpoint + "&language=" + URLGenerator.pageVariables.languageParameter + "&page=" + URLGenerator.pageVariables.pageNumber);


            }
        }

    }
    /**Returns an array of URL-objects, containing endpoints exposing a list of movie genres and tv show genres used in the
     * TMDB api for querying
     * 
     * @returns Array<URL> urlArray = [movieGenresUrl, tvShowGenresUrl]
     */
    static getGenreUrls(movieGenreIds, tvShowGenreIds) {

        let movieGenresEndpoint = URLGenerator.baseUrlTMDB + URLGenerator.tableEndpoints.genreMovies;
        let tvShowGenresEndpoint = URLGenerator.baseUrlTMDB + URLGenerator.tableEndpoints.genreTvShows;
        let returnMovieGenreEndpoints;
        let returnTvGenreEndpoints;


        if (movieGenreIds && !(tvShowGenreArray)) {
            returnMovieGenreEndpoints = new Array(movieGenreIds.length);
            movieGenreIds.forEach((movieGenreId, index) => {
                returnMovieGenreEndpoints[index] = new URL(movieGenresEndpoint + "/" + movieGenreId);



            });
            //once we finish the loop all urls are created since we only want one type and we return
            return returnMovieGenreEndpoints;


        }
        else if (tvShowGenreIds && !(movieGenreIds)) {
            returnTvGenreEndpoints = new Array(tvShowGenreIds.length);
            tvShowGenreIds.forEach((tvShowGenreIds, index) => {
                returnTvGenreEndpoints[index] = new URL(tvShowGenresEndpoint + "/" + tvShowGenreIds);
            });
            //once we finish the loop all urls are created since we only want one type and we return
            return returnTvGenreEndpoints;
        }
        else {


            return [new URL(movieGenresEndpoint), new URL(tvShowGenresEndpoint)];
        }




    }
    /**Gets a url with ready authorization to the iso-codes used for the language-parameter in TMDB
     * 
     * @returns URL tmdbLanguageIsoCodeList
     */
    static getLanguagesEndpoint() {
        let languageListEndpoint = URLGenerator.baseUrlTMDB + URLGenerator.tableEndpoints.languagesIsoCodes;
        return new URL(languageListEndpoint);


    }
    /**
     * The countries that are available as search-results in TMDB, for available languageParameters see getLanguageParameters
     * 
     * @returns URL tmdbCountryList
     */
    static getCountriesEndpoint() {
        let countryListEndpoint = URLGenerator.baseUrlTMDB + URLGenerator.tableEndpoints.countries;
        return new URL(countryListEndpoint);


    }
    /**Selects table with languageParameters
     * 
     * @returns URL to table of languageParameter options
     */
    static getLanguageParametersEndpoint() {
        let languageParametersEndpoint = URLGenerator.baseUrlTMDB + URLGenerator.tableEndpoints.primaryTranslations;
        return new URL(languageParametersEndpoint);

    }
    /** Gives the endpoint for a specific movie in the movie table
     * 
     * @param {number} movieId 
     */
    static getMovieEntity(movieId) {

        let movieEnpoint = URLGenerator.baseUrlTMDB + URLGenerator.tableEndpoints.movies + "/" + movieId + "?language=" + URLGenerator.pageVariables.languageParameter;
        return new URL(movieEnpoint);
    }



    /** Gives the endpoint for a specific show in the tv table
     * 
     * @param {number} tvId 
     * 
     */
    static getTvEntity(tvSeriesId) {

        let tvShowEndpoint = URLGenerator.baseUrlTMDB + URLGenerator.tableEndpoints.tvShows.base + "/" + tvSeriesId + "?language=" + URLGenerator.pageVariables.languageParameter+"&append_to_response=credits";
        return new URL(tvShowEndpoint);
    }

    /** Gives the endpoint for a specific person in the person table.
     * Each list returns a collection of ids that we can use to call on
     * 
     * @param {Array<number>} personIds 
     */
    static getPeopleById(personIds) {
        if (personIds.length > 1) {
            let personEndpoint = URLGenerator.baseUrlTMDB + URLGenerator.tableEndpoints.person + +"?language=" + URLGenerator.pageVariables.languageParameter + "&append_to_response=";
            personIds.forEach((personId, index) => {

                personEndpoint.concat("/" + personId + ", ");
            });

            return new URL(personEndpoint);

        }
        else {
            let personEndpoint = URLGenerator.baseUrlTMDB + URLGenerator.tableEndpoints.person + "/" + personIds + "?language=" + URLGenerator.pageVariables.languageParameter;


            return new URL(personEndpoint);

        }
    }

    static getPersonListUrl(endpoint) {
        if (URLGenerator.pageVariables.nextPageCount >= 20) {
            return URLGenerator.getNextPageOfList(endpoint);
        }   else {

            if (!endpoint.includes("?")) {
                return new URL(URLGenerator.baseUrlTMDB + endpoint + "?language=" + URLGenerator.pageVariables.languageParameter + "&page=" + URLGenerator.pageVariables.pageNumber);
            }
            
            else if(URLGenerator.pageVariables.pageNumber == 0 && (!endpoint.includes("?"))) {
                return new URL(URLGenerator.baseUrlTMDB + endpoint + "?language=" + URLGenerator.pageVariables.languageParameter + "&page=1");

            }
            else{
                                    return new URL(URLGenerator.baseUrlTMDB + endpoint + "&language=" + URLGenerator.pageVariables.languageParameter + "&page=" + URLGenerator.pageVariables.pageNumber);


            }
        }
    }
    /**
     * 
     * @param {string} tableEndpoint : /person, /tv or /movie 
     * @param {string} queryParameterValues : For example year=xxxx, title=xxx
     */
    static getSearchEndpoint(tableEndpoint, queryParameterValues) {
        let searchUrl = "/search" + tableEndpoint + "?";
        queryParameterValues.forEach((queryParameter, index) => {
            if (index < queryParameterValues.length - 1) {
                searchUrl += queryParameter + "&";
            }
            else {
                searchUrl += queryParameter;
            }
        })

        return searchUrl;


    }

    static getTvSeasosnUrl(tvShowId, numberOfSeasons) {

        if (tvShowId && numberOfSeasons) {
            if (numberOfSeasons.length > 1) {



                let urlString = URLGenerator.baseUrlTMDB + URLGenerator.tableEndpoints.tvShows.base + "/" + tvShowId + "?language=" + URLGenerator.pageVariables.languageParameter + "&append_to_response=";

                for (let i = 1; i < numberOfSeasons.length; i++) {

                    urlString += "season/" + [i] + ", ";
                }

                return new URL(urlString);
            }
            else {

                let urlString = URLGenerator.baseUrlTMDB + URLGenerator.tableEndpoints.tvShows.base + "/" + tvShowId + URLGenerator.tableEndpoints.tvShows.season + "/" + numberOfSeasons + "?language=" + URLGenerator.pageVariables.languageParameter;
                return new URL(urlString);
            }
        }

    }













    /**Gets a map of  genre-name/id-pairs for use in TMDB-queries and UI-exposure
     *  
     * 
     */

    // static async function getGenres() {

    //         let urlString = base_url+"/genre/movies/list";
    //         let url = new URL(urlString);
    //         try {
    //             Request()
    //            movieGenres = fetch(url).then((value)=> this.);
    //            )
    //         } catch (error) {

    //         }


    // }    


}

