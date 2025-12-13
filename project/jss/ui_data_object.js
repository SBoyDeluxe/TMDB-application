import * as ApiClient from "./api_client.js";
import URLGenerator from "./url_generator.js";


export class UIDataObject {
    /*We can use the following three statements to run the createLanguageSelectionObjectArray, which exposes 
    the information necessary for our languageSelection-prompt*/
    static languageObject = ApiClient.ApiClient.getLanguages();
    static countryObjectArray = ApiClient.ApiClient.getCountries();
    static languageParamsArray = ApiClient.ApiClient.getLanguageParameters();


    static promptLanguageSelection() {

        if(!navigator.onLine){
            alert("We can´t detect a network connection - Welcome back as soon as you get wifi!");
        }
        /*  <!-- A template for the language selection interface to be shown before documenting the primary home page content-->
        <template id = language_selection_template>
            
            <fieldset>
                            <legend><h3>Select Language</h3></legend>
        
                <!-- progress_bar_div is showing during loading of language-selection resources -> #progress_bar_div{document : gone} 
                 -> #language_selection_div{document: block}-->
                    <div id = "progress_bar_div">
                        <progress id="progress_bar" max = 100 value = 0> Please wait...</progress>
        
                    </div>
                    <div id = "language_selection_div">
                    <label for="language_selected"> Language : </label>
                          <input type ="text" list="language_selection_list" name = "language_selected" id = "language_selected">
                               <datalist id = "language_selection_list">
                                <!-- Options are added here from JS, we add evenlisteners for input => Upon selecting any option
                                     the text element with the name/id language_selected can be used to retrieve choice   -->
        
                            </datalist>
                    
                            <button id ="select_language_button"> Select language </button>
                    </div>        
            </fieldset>
        
        </template> */
        // Exposes all relevant elements from the language selection-template
        const languageSelection = document.getElementById("language_selection_template");
        const progressBarDiv = document.querySelector("#progress_bar_div");
        const progressBar = document.querySelector("#progress_bar");
        const languageSelectionDiv = document.getElementById("language_selection_div");
        const selectButton = document.getElementById("select_language_button");
        const dataList = document.getElementById("language_selection_list");
        //Represents the main content of the page after language selection
        const mainContent = document.getElementById("main_element");
        //represents the header of the page after language selection
        const header = document.getElementById("header_article");
        //Represents footer of the page after language selection
        const footer = document.getElementsByClassName("page_footer");
        //Hides main content of page + language selection screen  until we have retrieved a language selection 
        document.body.removeChild(mainContent);
        document.body.removeChild(header);







        //Awaits the resolve of all promises
        Promise.all([this.languageParamsArray, this.languageObject, this.countryObjectArray]).then((results) => {

            const selectionOptions = ApiClient.languageSelectionObject.createLanguageSelectionObjectArray(results[1], results[2], results[0]);
            let optionArray = new Array(selectionOptions.length);
            selectionOptions.forEach((option, index) => {
                let optionToCreate = document.createElement("option");
                //Not all languageObjects contain a .name-property, if it does not exist we need to print the englishName instead as both alt and
                // and text 
                optionToCreate.setAttribute("value", option.languageParameter.languageParameter);
                if ((option.languageObject.name != "" && option.country.nativeName != "") && (option.languageObject.name != undefined && option.country.nativeName != undefined)) {
                    //native name for both language and country exists
                    // optionToCreate.setAttribute("text", );
                    optionToCreate.setAttribute("alt", option.languageObject.englishName);
                    optionToCreate.setAttribute("label", option.languageObject.name + " ( " + option.country.nativeName + " )");
                }
                else if ((option.country.nativeName == "" || option.country.nativeName == undefined) && (option.languageObject.name != "" && option.languageObject.name != undefined)) {
                    //only native name for language exist

                    optionToCreate.setAttribute("label", option.languageObject.name + " ( " + option.country.englishNamee + " )");
                    optionToCreate.setAttribute("alt", option.languageObject.englishName);
                } else if ((option.languageObject.name == "" || option.languageObject.name == undefined) && (option.country.nativeName != "" || option.country.nativeName != undefined)) {
                    //only native name for country exist

                    optionToCreate.setAttribute("label", option.languageObject.name + " ( " + option.country.nativeName + " )");
                    optionToCreate.setAttribute("alt", option.languageObject.englishName);
                }
                else {

                    optionToCreate.setAttribute("label", option.languageObject.englishName + " ( " + option.country.englishName + " )");
                    optionToCreate.setAttribute("alt", option.languageObject.englishName);


                }
                //Adds option to datalist
                dataList.append(optionToCreate);

            });

            console.log(dataList);

            //Now that we have completed loading the resources we hide the progressbar and show our language selection-di

            progressBar.remove();

            selectButton.onclick = (event) => {
                URLGenerator.pageVariables.languageParameter = dataList[dataList.options.selectedIndex].value;

                presentIndexPage();

                let tvTabButton = document.getElementById("tv_shows_tab_button").addEventListener("click", () => {

                    let currentResultsArticle = document.getElementsByClassName("displayed_results");
                    let collectionOfChildren = Array.from(currentResultsArticle);
                    if (collectionOfChildren.length == 1) {
                        currentResultsArticle = collectionOfChildren[0];
                    }

                    //make sure we haven´t clicked twice on same tab

                    if (!(currentResultsArticle.attributes.id.nodeValue == "tv_series_wrapper_div")) {

                        let stringForClass = currentResultsArticle.attributes.class.nodeValue;
                        //split on whitespace and keep the first string as our display class thing
                        stringForClass = stringForClass.split(" ");
                        let newClassString = stringForClass[0] + " not_displayed_results";
                        //now its children get -> display:none
                        currentResultsArticle.setAttribute("class", newClassString);
                        //the children of said page get -> displayed
                        let wrappers = Array.from(document.getElementsByClassName("wrapper_div"));
                        let rightSelectionWrapper;
                        wrappers.forEach((element) => {
                            if (element.attributes.id.nodeValue == "tv_series_wrapper_div") {

                                rightSelectionWrapper = element;
                            }
                        });
                        rightSelectionWrapper.setAttribute("class", "wrapper_div displayed_results");
                        //if inside this statement we have changed table category, we reset pageCount to 1 
                        URLGenerator.resetElementCountAndPageNUmber();
                        UIDataObject.showResults(URLGenerator.tableEndpoints.topRatedTvShows, 10);
                    }


                });
                let personTabButton = document.getElementById("person_tab_button").addEventListener("click", () => {

                    let currentResultsArticle = document.getElementsByClassName("displayed_results");
                    let collectionOfChildren = Array.from(currentResultsArticle);
                    if (collectionOfChildren.length == 1) {
                        currentResultsArticle = collectionOfChildren[0]
                    }
                    if ((currentResultsArticle.attributes.id.nodeValue != "person_wrapper_div")) {

                        let stringForClass = currentResultsArticle.attributes.class.nodeValue;
                        //split on whitespace and keep the first string as our display class thing
                        stringForClass = stringForClass.split(" ");
                        let newClassString = stringForClass[0] + " not_displayed_results";
                        //now its children get -> display:none
                        currentResultsArticle.setAttribute("class", newClassString);
                        //the children of said page get -> displayed
                        //the children of said page get -> displayed
                        let wrappers = Array.from(document.getElementsByClassName("wrapper_div"));
                        let rightSelectionWrapper;
                        wrappers.forEach((element) => {
                            if (element.attributes.id.nodeValue == "person_wrapper_div") {

                                rightSelectionWrapper = element;
                            }
                        });
                        rightSelectionWrapper.setAttribute("class", "wrapper_div displayed_results");
                        //if inside this statement we have changed table category, we reset pageCount to 1 
                        URLGenerator.resetElementCountAndPageNUmber();
                        UIDataObject.showResults(URLGenerator.tableEndpoints.popularPeople, 10);
                        //if inside this statement we have changed table category, we reset pageCount to 1 


                    }
                });
                let movieTabButton = document.getElementById("movie_tab_button").addEventListener("click", () => {

                    let currentResultsArticle = document.getElementsByClassName("displayed_results");
                    let collectionOfChildren = Array.from(currentResultsArticle);
                    if (collectionOfChildren.length == 1) {
                        currentResultsArticle = collectionOfChildren[0]
                    }
                    if ((currentResultsArticle.attributes.id.nodeValue != "movie_wrapper_div")) {

                        let stringForClass = currentResultsArticle.attributes.class.nodeValue;
                        //split on whitespace and keep the first string as our display class thing
                        stringForClass = stringForClass.split(" ");
                        let newClassString = stringForClass[0] + " not_displayed_results";
                        //now its children get -> display:none
                        currentResultsArticle.setAttribute("class", newClassString);
                        //the children of said page get -> displayed
                        //the children of said page get -> displayed
                        let wrappers = Array.from(document.getElementsByClassName("wrapper_div"));
                        let rightSelectionWrapper;
                        wrappers.forEach((element) => {
                            if (element.attributes.id.nodeValue == "movie_wrapper_div") {

                                rightSelectionWrapper = element;
                            }
                        });
                        rightSelectionWrapper.setAttribute("class", "wrapper_div displayed_results");
                        document.getElementById("movie_wrapper_div").setAttribute("class", "wrapper_div displayed_results");
                        //if inside this statement we have changed table category, we reset pageCount to 1 
                        URLGenerator.resetElementCountAndPageNUmber();
                        UIDataObject.showResults(URLGenerator.tableEndpoints.topRatedMovies, 10);


                    }
                });


                UIDataObject.showResults(URLGenerator.tableEndpoints.topRatedMovies, 10);

                presentFilterOptions();


                /** <select id="movie_list_select">
                                    <!--Add options to designate what options to search on : Keyword, year etc-->
                                </select>
                                <label for="movie_number_of_results">Number of results per page</label>
                                <input id="movie_number_of_results" type="number" min="1" max="20" value="10" >
                                <button id="movie_refresh_results">Refresh</button> */




                let movieListSelectElement = document.getElementById("movie_list_select");

                setUpMovieListSelection(movieListSelectElement);

                let personListSelectElement = document.getElementById("person_list_select");
                setUpPersonListSelection(personListSelectElement);
                let tvListSelectElement = document.getElementById("tv_list_select");

                setUpTvListSelection(tvListSelectElement);











                function presentIndexPage() {
                    languageSelectionDiv.remove();
                    document.body.append(header);
                    document.body.append(mainContent);
                    document.body.append(footer);
                }
            }






        });


        function setUpMovieListSelection(movieListSelectElement) {

            let movieRefreshButton = document.getElementById("movie_refresh_results");
            let nextPageButton = document.getElementById("movie_next_page");


            let topRatedOption = document.createElement("option");
            let popularOption = document.createElement("option");
            let trendingOption = document.createElement("option");

            topRatedOption.setAttribute("value", URLGenerator.tableEndpoints.topRatedMovies);

            topRatedOption.setAttribute("alt", "Get a list of the top rated movies by users of TMDB");
            topRatedOption.setAttribute("label", "Top rated");

            popularOption.setAttribute("value", URLGenerator.tableEndpoints.popularMovies);

            popularOption.setAttribute("alt", "Get a list of the most popular movies by users of TMDB");
            popularOption.setAttribute("label", "Popular");


            trendingOption.setAttribute("value", URLGenerator.tableEndpoints.trending.movies);

            trendingOption.setAttribute("alt", "Get a list of the most popular movies by users of TMDB");
            trendingOption.setAttribute("label", "Trending");



            let dayOption = document.createElement("option");

            dayOption.setAttribute("value", "/day");

            dayOption.setAttribute("alt", "Get movies trending over the last day");
            dayOption.setAttribute("label", "Time frame for trending : Today");
            let weekOption = document.createElement("option");

            weekOption.setAttribute("value", "/week");

            weekOption.setAttribute("alt", "Get movies trending over the last week");
            weekOption.setAttribute("label", "Time frame for trending : Last week");

            let timeFrameSelectElement = document.createElement("select");
            timeFrameSelectElement.append(dayOption, weekOption);
            timeFrameSelectElement.setAttribute("class", "not_displayed_results");


            movieListSelectElement.parentElement.append(timeFrameSelectElement);

            movieListSelectElement.append(topRatedOption, popularOption, trendingOption);

            //Trending requires day or week to be input
            movieListSelectElement.addEventListener("change", () => {

                if (movieListSelectElement.options.selectedIndex != 2) {
                    timeFrameSelectElement.setAttribute("class", "not_displayed_element");

                }
                else {
                    timeFrameSelectElement.setAttribute("class", "displayed_element");

                }
            });

            nextPageButton.addEventListener("click", () => {
                //on preseeing reset button we want to see refresh to chosen list with number of results given
                let movieNumberOfElementsInput = document.getElementById("movie_number_of_results");



                switch (movieListSelectElement.options.selectedIndex) {
                    case 0: UIDataObject.showResults(movieListSelectElement.options[0].attributes.value.nodeValue, +movieNumberOfElementsInput.value);


                        break;
                    case 1: UIDataObject.showResults(movieListSelectElement.options[1].attributes.value.nodeValue, +movieNumberOfElementsInput.value);

                        break;
                    case 2: UIDataObject.showResults(movieListSelectElement.options[2].attributes.value.nodeValue + timeFrameSelectElement.options[timeFrameSelectElement.selectedIndex].attributes.value.nodeValue, movieNumberOfElementsInput.value);

                        break;

                    default:
                        break;
                }










            });

            movieRefreshButton.addEventListener("click", () => {
                //on preseeing reset button we want to see refresh to chosen list with number of results given
                let movieNumberOfElementsInput = document.getElementById("movie_number_of_results");



                switch (movieListSelectElement.options.selectedIndex) {
                    case 0: URLGenerator.resetElementCountAndPageNUmber();
                        UIDataObject.showResults(movieListSelectElement.options[0].attributes.value.nodeValue, movieNumberOfElementsInput.value);


                        break;
                    case 1: URLGenerator.resetElementCountAndPageNUmber();
                        UIDataObject.showResults(movieListSelectElement.options[1].attributes.value.nodeValue, movieNumberOfElementsInput.value);

                        break;
                    case 2: URLGenerator.resetElementCountAndPageNUmber();
                        UIDataObject.showResults(movieListSelectElement.options[2].attributes.value.nodeValue + timeFrameSelectElement.value, movieNumberOfElementsInput.value);

                        break;

                    default:
                        break;
                }










            });

        }
        function setUpTvListSelection(tvListSelectElement) {

            let tvRefreshButton = document.getElementById("tv_refresh_results");
            let nextPageButton = document.getElementById("tv_next_page");


            let topRatedOption = document.createElement("option");
            let popularOption = document.createElement("option");
            let trendingOption = document.createElement("option");

            topRatedOption.setAttribute("value", URLGenerator.tableEndpoints.topRatedTvShows);

            topRatedOption.setAttribute("alt", "Get a list of the top rated people by users of TMDB");
            topRatedOption.setAttribute("label", "Top rated");

            popularOption.setAttribute("value", URLGenerator.tableEndpoints.popularTvShows);

            popularOption.setAttribute("alt", "Get a list of the most popular people by users of TMDB");
            popularOption.setAttribute("label", "Popular");


            trendingOption.setAttribute("value", URLGenerator.tableEndpoints.trending.tvShows);

            trendingOption.setAttribute("alt", "Get a list of the most popular people by users of TMDB");
            trendingOption.setAttribute("label", "Trending");



            let dayOption = document.createElement("option");

            dayOption.setAttribute("value", "/day");

            dayOption.setAttribute("alt", "Get people trending over the last day");
            dayOption.setAttribute("label", "Time frame for trending : Today");
            let weekOption = document.createElement("option");

            weekOption.setAttribute("value", "/week");

            weekOption.setAttribute("alt", "Get people trending over the last week");
            weekOption.setAttribute("label", "Time frame for trending : Last week");

            let timeFrameSelectElement = document.createElement("select");
            timeFrameSelectElement.append(dayOption, weekOption);
            timeFrameSelectElement.setAttribute("class", "not_displayed_element");


            tvListSelectElement.parentElement.append(timeFrameSelectElement);

            tvListSelectElement.append(topRatedOption, popularOption, trendingOption);

            //Trending requires day or week to be input
            tvListSelectElement.addEventListener("change", () => {

                if (tvListSelectElement.options.selectedIndex != 2) {
                    timeFrameSelectElement.setAttribute("class", "not_displayed_element");

                }
                else {
                    timeFrameSelectElement.setAttribute("class", "displayed_element");

                }
            });

            nextPageButton.addEventListener("click", () => {
                //on preseeing reset button we want to see refresh to chosen list with number of results given
                let tvNumberOfElementsInput = document.getElementById("tv_number_of_results");



                switch (tvListSelectElement.options.selectedIndex) {
                    case 0: UIDataObject.showResults(tvListSelectElement.options[0].attributes.value.nodeValue, +tvNumberOfElementsInput.value);


                        break;
                    case 1: UIDataObject.showResults(tvListSelectElement.options[1].attributes.value.nodeValue, +tvNumberOfElementsInput.value);

                        break;
                    case 2: UIDataObject.showResults(tvListSelectElement.options[2].attributes.value.nodeValue + timeFrameSelectElement.options[timeFrameSelectElement.selectedIndex].attributes.value.nodeValue, tvNumberOfElementsInput.value);

                        break;

                    default:
                        break;
                }










            });

            tvRefreshButton.addEventListener("click", () => {
                //on preseeing reset button we want to see refresh to chosen list with number of results given
                let tvNumberOfElementsInput = document.getElementById("tv_number_of_results");



                switch (tvListSelectElement.options.selectedIndex) {
                    case 0: URLGenerator.resetElementCountAndPageNUmber();
                        UIDataObject.showResults(tvListSelectElement.options[0].attributes.value.nodeValue, tvNumberOfElementsInput.value);


                        break;
                    case 1: URLGenerator.resetElementCountAndPageNUmber();
                        UIDataObject.showResults(tvListSelectElement.options[1].attributes.value.nodeValue, tvNumberOfElementsInput.value);

                        break;
                    case 2: URLGenerator.resetElementCountAndPageNUmber();
                        UIDataObject.showResults(tvListSelectElement.options[2].attributes.value.nodeValue + timeFrameSelectElement.value, tvNumberOfElementsInput.value);

                        break;

                    default:
                        break;
                }










            });

        }


        function setUpPersonListSelection(personListSelectElement) {

            let personSearchForm = document.getElementById("person-search-form");

            let personRefreshButton = document.getElementById("person_refresh_results");
            let nextPageButton = document.getElementById("person_next_page");


            let popularOption = document.createElement("option");

            let trendingOption = document.createElement("option");



            popularOption.setAttribute("value", URLGenerator.tableEndpoints.popularPeople);

            popularOption.setAttribute("alt", "Get a list of the most popular movies by users of TMDB");
            popularOption.setAttribute("label", "Popular");


            trendingOption.setAttribute("value", URLGenerator.tableEndpoints.trending.people);

            trendingOption.setAttribute("alt", "Get a list of the most popular movies by users of TMDB");
            trendingOption.setAttribute("label", "Trending");



            let dayOption = document.createElement("option");

            dayOption.setAttribute("value", "/day");

            dayOption.setAttribute("alt", "Get people trending over the last day");
            dayOption.setAttribute("label", "Time frame for trending : Today");
            let weekOption = document.createElement("option");

            weekOption.setAttribute("value", "/week");

            weekOption.setAttribute("alt", "Get people trending over the last week");
            weekOption.setAttribute("label", "Time frame for trending : Last week");

            let timeFrameSelectElement = document.createElement("select");
            timeFrameSelectElement.append(dayOption, weekOption);
            timeFrameSelectElement.setAttribute("class", "not_displayed_element");


            personListSelectElement.parentElement.append(timeFrameSelectElement);

            personListSelectElement.append(popularOption, trendingOption);

            //Trending requires day or week to be input
            personListSelectElement.addEventListener("change", () => {



                if (personListSelectElement.options.selectedIndex != 1) {

                    timeFrameSelectElement.setAttribute("class", "not_displayed_element");

                }
                else {
                    timeFrameSelectElement.setAttribute("class", "displayed_element");

                }
            });

            nextPageButton.addEventListener("click", () => {
                //on preseeing reset button we want to see refresh to chosen list with number of results given
                let personNumberOfElementsInput = document.getElementById("person_number_of_results");



                switch (personListSelectElement.options.selectedIndex) {
                    case 0: UIDataObject.showResults(personListSelectElement.options[0].attributes.value.nodeValue, +personNumberOfElementsInput.value);


                        break;
                    case 1: UIDataObject.showResults(personListSelectElement.options[1].attributes.value.nodeValue + timeFrameSelectElement.options[timeFrameSelectElement.selectedIndex].value, +personNumberOfElementsInput.value);

                        break;


                    default:
                        break;
                }










            });

            personRefreshButton.addEventListener("click", () => {
                //on preseeing reset button we want to see refresh to chosen list with number of results given
                let personNumberOfElementsInput = document.getElementById("person_number_of_results");



                switch (personListSelectElement.options.selectedIndex) {
                    case 0: URLGenerator.resetElementCountAndPageNUmber();
                        UIDataObject.showResults(personListSelectElement.options[0].attributes.value.nodeValue, personNumberOfElementsInput.value);


                        break;
                    case 1: URLGenerator.resetElementCountAndPageNUmber();
                        UIDataObject.showResults(personListSelectElement.options[1].attributes.value.nodeValue + timeFrameSelectElement.options[timeFrameSelectElement.selectedIndex].value, personNumberOfElementsInput.value);

                        break;
                    case 2: URLGenerator.resetElementCountAndPageNUmber();
                        UIDataObject.showResults(personListSelectElement.options[2].attributes.value.nodeValue, personNumberOfElementsInput.value);

                        break;

                    default:
                        break;
                }










            });

        }
    }
    /**When opening page : top 10 movies, h2-tag above results 
     * 
     * Called on new list type, nextPageButton click and on search
     * 
     * @param {string} textToPresent 
     */
    static setTextTitleForSelection(textToPresent, detailText) {
        let oldDetails = document.getElementById("page_details");
        if (oldDetails) { oldDetails.remove(); }
        let details = document.createElement("details");
        details.setAttribute("id", "page_details");
        let summary = document.createElement("summary");
        summary.innerText = "Page information";

        details.innerText = detailText;
        details.append(summary);
        const displayedResultsDivCollection = document.getElementsByClassName("displayed_results");
        const idString = displayedResultsDivCollection[0].id;

        switch (idString) {
            case "person_wrapper_div": document.getElementById("people_title_of_selection").innerText = textToPresent;
                document.getElementById("people_title_of_selection").parentElement.prepend(details);



                break;

            case "tv_series_wrapper_div": document.getElementById("tv_series_selection_title").innerText = textToPresent;

                document.getElementById("tv_series_selection_title").parentElement.prepend(details);

                break;

            case "movie_wrapper_div": document.getElementById("movie_selection_title").innerText = textToPresent;

                document.getElementById("movie_selection_title").parentElement.prepend(details);

                break;



            default: alert("We could not find any results for your search")
                break;

        }




    }
    /**
     * 
     * @param {URLGenerator.tableEndpoint } entityResultList 
     * @param {number} numberOfElements : if omitted as many as are available at table-endpoint will be presented
     */
    static showResults(tableEndpoint, numberOfElements) {

        let displayElement = document.getElementsByClassName("displayed_results");
        let collectionOfChildren = Array.from(displayElement);
        if (collectionOfChildren.length == 1) {
            displayElement = collectionOfChildren[0];

            //Makes sure we don´t miss results, remaining results can´t be larger than current results
            if (20 - URLGenerator.pageVariables.nextPageCount < numberOfElements && (URLGenerator.pageVariables.nextPageCount != 20)) {

                numberOfElements = (20 - URLGenerator.pageVariables.nextPageCount);
            }


            let idString = displayElement.id;

            switch (idString) {
                case "person_wrapper_div": UIDataObject.getSelectionOfPeople(tableEndpoint, numberOfElements);


                    break;

                case "tv_series_wrapper_div": UIDataObject.getSelectionOfTvShows(tableEndpoint, numberOfElements);

                    break;

                case "movie_wrapper_div": UIDataObject.getSelectionOfMovies(tableEndpoint, numberOfElements);

                    break;


                default:
                    break;

            }
        }






    }





    /**
     * 
     * @param {URLGenerator.tableEndpoint | URL from url_generator} tableEndpoint 
     * @param {number} numberOfElements 
     */
    static getSelectionOfMovies(tableEndpoint, numberOfElements) {
        let totalResults;
        let totalPages;
        const progressBarDiv = UIDataObject.createLoadingIndicator();

        const moviesMainSection = document.getElementById("movies_main_element");

        moviesMainSection.prepend(progressBarDiv);


        const moviePromise = ApiClient.ApiClient.getMovieList(tableEndpoint).then((movieList) => {
            //If we obtain an empty response, totalResultss == 0, we tell the user no results could be found 


            totalPages = movieList.totalPages;
            totalResults = movieList.totalResults;

            return Promise.allSettled(movieList.movieResults);
        }).catch((error) => alert(error));
        moviePromise.then((top10List) => {
            moviesMainSection.removeChild(progressBarDiv);
            if (totalResults == 0) {

                alert("Sorry! No results were found on those search parameters!");
                let movieRefreshButton = document.getElementById("movie_refresh_results");
                movieRefreshButton.click();
                return;


            }
            const movieResultsContainerDiv = document.getElementById("movie_selection_div");
            if (movieResultsContainerDiv.hasChildNodes) {

                UIDataObject.emptyDisplayedResultsContainer(movieResultsContainerDiv);
            }




            //In searches we can end up with fewer results than wanted 
            if (totalResults < +numberOfElements) {
                numberOfElements = totalResults;

            }


            let movieResultDivs = UIDataObject.showImagesForResult(top10List, movieResultsContainerDiv, 1, numberOfElements);

            movieResultDivs.forEach((movieResultDiv, index) => {
                // To convert runtimme to hours we see what the remainder is when dividing with 60. Subtracting this from the runtime will give us the closest value 
                // divisible by 60
                let remainderOfRuntimeInHours = top10List[index + URLGenerator.pageVariables.nextPageCount].value.movieTimeObject.runtime % 60;
                let runtimeInHours = (top10List[index + URLGenerator.pageVariables.nextPageCount].value.movieTimeObject.runtime - remainderOfRuntimeInHours) / 60;

                UIDataObject.createRubyNotationText(top10List[index + URLGenerator.pageVariables.nextPageCount].value.title, top10List[index + URLGenerator.pageVariables.nextPageCount].value.movieTimeObject.releaseDate + " (" + runtimeInHours + " h " + remainderOfRuntimeInHours + " min.  -  " + top10List[index + URLGenerator.pageVariables.nextPageCount].value.movieTimeObject.runtime + " minutes ) ", movieResultDiv);


            });

            //updating the title element to reflect the presentedElements -> We either have search-results, trending, popular or top rated
            // The number of elements we have shown are 20*UrlGenerator.pageNumber + pageVariables.nextPageCount
            const totalNumberShown = (URLGenerator.pageVariables.pageNumber - 1) * 20 + URLGenerator.pageVariables.nextPageCount;
            let totalPagesShowInRelationToNmbrOfElmnts = ((totalNumberShown - (totalNumberShown % numberOfElements)) / numberOfElements) + 1;
            let totalPagesnRelationToNmbrOfElmnts = ((totalResults - (totalResults % numberOfElements)) / numberOfElements);
            if ((totalNumberShown % numberOfElements) > 0) {
                totalPagesShowInRelationToNmbrOfElmnts++;
            }
            if ((totalResults % numberOfElements) > 0) {
                totalPagesnRelationToNmbrOfElmnts++;
            }


            let pageSelect = document.getElementById("movie_page_select");

            switch (tableEndpoint) {
                case URLGenerator.tableEndpoints.popularMovies:
                    UIDataObject.setTextTitleForSelection(`Popular movies : showing result  ${totalNumberShown + 1} -> ${+totalNumberShown + +numberOfElements}`, `\n  Total results : ${totalResults} movies  
                                    \n Currently on Page : ${totalPagesShowInRelationToNmbrOfElmnts} out of ${totalPagesnRelationToNmbrOfElmnts} (${((totalPagesShowInRelationToNmbrOfElmnts / totalPagesnRelationToNmbrOfElmnts)) * 100} % has been shown) `);

                    break;
                case URLGenerator.tableEndpoints.topRatedMovies:
                    UIDataObject.setTextTitleForSelection(`Top Rated Movies : showing result  ${totalNumberShown + 1} -> ${+totalNumberShown + +numberOfElements}`, `\n  Total results : ${totalResults} movies  
                                    \n Currently on Page : ${totalPagesShowInRelationToNmbrOfElmnts} out of ${totalPagesnRelationToNmbrOfElmnts} (${((totalPagesShowInRelationToNmbrOfElmnts / totalPagesnRelationToNmbrOfElmnts)) * 100} % has been shown)  `);

                    break;

                case URLGenerator.tableEndpoints.trending.movies + "/day":
                    UIDataObject.setTextTitleForSelection(` Trending (today) : showing result ${totalNumberShown + 1} -> ${+totalNumberShown + +numberOfElements}`, `\n  Total results : ${totalResults} movies  
                                    \n Currently on Page : ${totalPagesShowInRelationToNmbrOfElmnts} out of ${totalPagesnRelationToNmbrOfElmnts} (${((totalPagesShowInRelationToNmbrOfElmnts / totalPagesnRelationToNmbrOfElmnts)) * 100} % has been shown) `);

                    break;
                case URLGenerator.tableEndpoints.trending.movies + "/week":
                    UIDataObject.setTextTitleForSelection(` Trending (this week) : showing result ${totalNumberShown + 1} -> ${+totalNumberShown + +numberOfElements}`, `\n  Total results : ${totalResults} movies  
                                    \n Currently on Page : ${totalPagesShowInRelationToNmbrOfElmnts} out of ${totalPagesnRelationToNmbrOfElmnts} (${((totalPagesShowInRelationToNmbrOfElmnts / totalPagesnRelationToNmbrOfElmnts)) * 100} % has been shown) `);

                    break;

                default:
                    break;
            }

            UIDataObject.increaseElementResultCount(numberOfElements);







        });
        //Upon completing actually showing the results on screen we increase the pageCount 


    }
    static createLoadingIndicator() {
        const progressBarDiv = document.createElement("div");
        const progressBar = document.createElement("progress");
        const loadingText = document.createElement("i");
        loadingText.textContent = "Getting results...";
        progressBarDiv.setAttribute("id", "progress_bar_div");
        progressBar.setAttribute("id", "progress_bar");
        progressBarDiv.append(loadingText);
        progressBarDiv.append(progressBar);
        return progressBarDiv;
    }

    /**
     * 
     * @param {number} numberOfElements 
     * @returns
     */
    static increaseElementResultCount(numberOfElements) {
        URLGenerator.addToNumberOfShownResults(numberOfElements);
    }
    /** Posts an alert for user on error meaning
     * 
     * @param {Error} error 
     */
    static alertOfError(error) {

        let errorObject = {
            47: " The input is not valid.",
            22: "Invalid page: Please try selecting a lower page number ",
            9: "Service offline: This service is temporarily offline, try again later. ",
            25: "Your request count(#) is over the allowed limit of(40)",
            46: "The API is undergoing maintenance.Try again later.",
        };

        errorObject.forEach((errorCode) => {

            if (error.message.includes(errorCode)) {

                alert(errorCode);
            }

        });

    }

    /**
     * 
     * @param {URLGenerator.tableEndpoint} tableEndpoint 
     *      * @param {number | null} numberOfElements : if the numberOfElements can´t pass if(numberOfElements), all available elements are presented 

     */
    static getSelectionOfTvShows(tableEndpoint, numberOfElements) {

        let totalResults;
        let totalPages;
        const progressBarDiv = UIDataObject.createLoadingIndicator();

        const tvSeriesMainSection = document.getElementById("tv_series_main_section");

        tvSeriesMainSection.prepend(progressBarDiv);

        const tvPromise = ApiClient.ApiClient.getTvList(tableEndpoint).then((tvList) => {
            totalPages = tvList.total_pages;
            totalResults = tvList.total_results;
            if (totalResults == 0) {

                alert("Sorry! No results were found on those search parameters!");
                let tvRefreshButton = document.getElementById("tv_refresh_results");
                tvRefreshButton.click();
                return;


            }
            return Promise.allSettled(tvList.results);

        }).catch((error) => alert(error));

        tvPromise.then((top10List) => {
            tvSeriesMainSection.removeChild(progressBarDiv);


            const tvResultsContainerDiv = document.getElementById("tv_series_selection_div");
            if (tvResultsContainerDiv.hasChildNodes) {

                UIDataObject.emptyDisplayedResultsContainer(tvResultsContainerDiv);
            }

            //If we perform a search the number of results might be smaller than our number of elements

            if (+numberOfElements > totalResults) {
                numberOfElements = totalResults;
            }


            let tvResultDivs = UIDataObject.showImagesForResult(top10List, tvResultsContainerDiv, 1, numberOfElements);
            tvResultDivs.forEach((tvresultDiv, index) => {
                // To convert runtimme to hours we see what the remainder is when dividing with 60. Subtracting this from the runtime will give us the closest value 
                // divisible by 60
                /* let remainderOfRuntimeInHours = top10List[index].value.timeObject.runtime % 60;
                let runtimeInHours = (top10List[index].value.timeObject.runtime - remainderOfRuntimeInHours) / 60; */
                UIDataObject.createRubyNotationText(top10List[index + URLGenerator.pageVariables.nextPageCount].value.name, top10List[index + URLGenerator.pageVariables.nextPageCount].value.timeObject.firstAirDate + " -> " + top10List[index + URLGenerator.pageVariables.nextPageCount].value.timeObject.lastAirDate, tvresultDiv);

            });

            //updating the title element to reflect the presentedElements -> We either have search-results, trending, popular or top rated
            // The number of elements we have shown are 20*UrlGenerator.pageNumber + pageVariables.nextPageCount
            const totalNumberShown = (URLGenerator.pageVariables.pageNumber - 1) * 20 + URLGenerator.pageVariables.nextPageCount;
            let totalPagesShowInRelationToNmbrOfElmnts = ((totalNumberShown - (totalNumberShown % numberOfElements)) / numberOfElements) + 1;
            let totalPagesnRelationToNmbrOfElmnts = ((totalResults - (totalResults % numberOfElements)) / numberOfElements);
            if ((totalNumberShown % numberOfElements) > 0) {
                totalPagesShowInRelationToNmbrOfElmnts++;
            }
            if ((totalResults % numberOfElements) > 0) {
                totalPagesnRelationToNmbrOfElmnts++;
            }

            switch (tableEndpoint) {
                case URLGenerator.tableEndpoints.popularTvShows:
                    UIDataObject.setTextTitleForSelection(`Popular Tv-shows : showing result  ${totalNumberShown + 1} -> ${+totalNumberShown + +numberOfElements}`, `\n  Total results: ${totalResults} tv-shows  
                                    \n Currently on Page : ${totalPagesShowInRelationToNmbrOfElmnts} out of ${totalPagesnRelationToNmbrOfElmnts} (${((totalPagesShowInRelationToNmbrOfElmnts / totalPagesnRelationToNmbrOfElmnts)) * 100} % has been shown) `);

                    break;
                case URLGenerator.tableEndpoints.topRatedTvShows:
                    UIDataObject.setTextTitleForSelection(`Top Rated Tv-shows : showing result  ${totalNumberShown + 1} -> ${+totalNumberShown + +numberOfElements}`, `\n  Total results: ${totalResults} tv-shows  
                                    \n Currently on Page : ${totalPagesShowInRelationToNmbrOfElmnts} out of ${totalPagesnRelationToNmbrOfElmnts} (${((totalPagesShowInRelationToNmbrOfElmnts / totalPagesnRelationToNmbrOfElmnts)) * 100} % has been shown)  `);

                    break;

                case URLGenerator.tableEndpoints.trending.tvShows + "/day":
                    UIDataObject.setTextTitleForSelection(` Trending Tv-shows (today) : showing result ${totalNumberShown + 1} -> ${+totalNumberShown + +numberOfElements}`, `\n  Total results: ${totalResults} tv-shows  
                                    \n Currently on Page : ${totalPagesShowInRelationToNmbrOfElmnts} out of ${totalPagesnRelationToNmbrOfElmnts} (${((totalPagesShowInRelationToNmbrOfElmnts / totalPagesnRelationToNmbrOfElmnts)) * 100} % has been shown) `);

                    break;
                case URLGenerator.tableEndpoints.trending.tvShows + "/week":
                    UIDataObject.setTextTitleForSelection(` Trending Tv-shows Shows (This Week) : Showing Result ${totalNumberShown + 1} -> ${+totalNumberShown + +numberOfElements}`, `\n  Total results: ${totalResults} tv-shows  
                                    \n Currently on Page : ${totalPagesShowInRelationToNmbrOfElmnts} out of ${totalPagesnRelationToNmbrOfElmnts} (${((totalPagesShowInRelationToNmbrOfElmnts / totalPagesnRelationToNmbrOfElmnts)) * 100} % has been shown) `);

                    break;

                default:
                    break;
            }
            //Upon completing actually showing the results on screen we increase the pageCount 

            UIDataObject.increaseElementResultCount(numberOfElements);



        });


    }
    /**
     * 
     * @param {URLGenerator.tableEndpoint} tableEndpoint 
     *      * @param {number | null} numberOfElements : if the numberOfElements can´t pass if(numberOfElements), all available elements are presented 

     */
    static getSelectionOfPeople(tableEndpoint, numberOfElements) {
        let returnObject;

        let totalPages;
        let totalResults;



        const progressBarDiv = UIDataObject.createLoadingIndicator();

        const personMainSection = document.getElementById("person_main_section");

        personMainSection.prepend(progressBarDiv);
        //Personlist throws errors to catch if something goes wrong with the fetching call - Network down etc.
        const personEntityPromise = ApiClient.ApiClient.getPersonList(tableEndpoint).then((personResultList) => {
            totalPages = personResultList.totalPages;
            totalResults = personResultList.totalResults;
            //Settled means future settled, not guaranteed success 
            return Promise.allSettled(personResultList.personResults);

        }).catch((error) => alert(error));



        //Display the given entities now constructed 
        personEntityPromise.then((personList) => {

            if (totalResults == 0) {


                personMainSection.removeChild(progressBarDiv);
                alert("Sorry, no results were found matching that search!");


                const personRefreshButton = document.getElementById("person_refresh_results");

                //
                // Refreshes the selection to list-selection (top 1->20 popular, trending etc.) using the given settings in selection field 
                personRefreshButton.click();

            } else {

                // All results have loaded, remove progess bar
                personMainSection.removeChild(progressBarDiv);
                const personResultsContainerDiv = document.getElementById("person_selection_div");

                if (personResultsContainerDiv.hasChildNodes) {

                    UIDataObject.emptyDisplayedResultsContainer(personResultsContainerDiv);
                }






                let personResultDivs = UIDataObject.showImagesForResult(personList, personResultsContainerDiv, 2, numberOfElements);
                personResultDivs.forEach((personResultDiv, index) => {
                    // To convert runtimme to hours we see what the remainder is when dividing with 60. Subtracting this from the runtime will give us the closest value 
                    // divisible by 60

                    let knownForString = "";
                    if (personList[index + URLGenerator.pageVariables.nextPageCount].value.knownFor.media) {

                        let movies = personList[index + URLGenerator.pageVariables.nextPageCount].value.knownFor.media.filter((media) => media["media_type"] == "movie");
                        let series = personList[index + URLGenerator.pageVariables.nextPageCount].value.knownFor.media.filter((media) => media["media_type"] == "tv");
                        knownForString = "Known from : "

                        if (movies) {
                            let movieString = "Movie(s) :";
                            movies.forEach((element, index) => {

                                switch (index) {
                                    case movies.length - 1:
                                        (movieString += element.title + "\n");

                                        break;

                                    default: movieString += element.title + ", ";

                                        break;
                                }
                            });
                            if (movieString != "Movie(s) :") {
                                knownForString += movieString;
                            }

                        }
                        if (series && series.length > 0) {
                            let seriesString = "Tv :";
                            series.forEach((element, index) => {

                                switch (index) {
                                    case series.length - 1:
                                        (seriesString += element.name + "\n");

                                        break;

                                    default: seriesString += element.name + ", ";

                                        break;
                                }
                            });
                            if (seriesString != "Tv :") {
                                knownForString += seriesString;
                            }
                        }


                    }
                    UIDataObject.createRubyNotationText(personList[index + URLGenerator.pageVariables.nextPageCount].value.name, knownForString, personResultDiv);


                });

                //updating the title element to reflect the presentedElements -> We either have search-results, trending, popular or top rated
                // The number of elements we have shown are 20*UrlGenerator.pageNumber + pageVariables.nextPageCount
                const totalNumberShown = (URLGenerator.pageVariables.pageNumber - 1) * 20 + URLGenerator.pageVariables.nextPageCount;
                let totalPagesShowInRelationToNmbrOfElmnts = ((totalNumberShown - (totalNumberShown % numberOfElements)) / numberOfElements) + 1;
                let totalPagesnRelationToNmbrOfElmnts = ((totalResults - (totalResults % numberOfElements)) / numberOfElements);
                if ((totalNumberShown % numberOfElements) > 0) {
                    totalPagesShowInRelationToNmbrOfElmnts++;
                }
                if ((totalResults % numberOfElements) > 0) {
                    totalPagesnRelationToNmbrOfElmnts++;
                }


                let pageSelect = document.getElementById("person_page_select");

                switch (tableEndpoint) {
                    case URLGenerator.tableEndpoints.popularPeople:
                        UIDataObject.setTextTitleForSelection(`Popular People : showing result  ${totalNumberShown + 1} -> ${+totalNumberShown + +numberOfElements}`, `\n Total results : ${totalResults} people  
                                    \n Currently on Page : ${totalPagesShowInRelationToNmbrOfElmnts} out of ${totalPagesnRelationToNmbrOfElmnts} (${((totalPagesShowInRelationToNmbrOfElmnts / totalPagesnRelationToNmbrOfElmnts)) * 100} % has been shown) `);

                        break;


                    case URLGenerator.tableEndpoints.trending.people + "/day":
                        UIDataObject.setTextTitleForSelection(` Trending (today) : showing result ${totalNumberShown + 1} -> ${+totalNumberShown + +numberOfElements}`, `\n Total results : ${totalResults} people  
                                    \n Currently on Page : ${totalPagesShowInRelationToNmbrOfElmnts} out of ${totalPagesnRelationToNmbrOfElmnts} (${((totalPagesShowInRelationToNmbrOfElmnts / totalPagesnRelationToNmbrOfElmnts)) * 100} % has been shown) `);

                        break;
                    case URLGenerator.tableEndpoints.trending.People + "/week":
                        UIDataObject.setTextTitleForSelection(` Trending (this week) : showing result ${totalNumberShown + 1} -> ${+totalNumberShown + +numberOfElements}`, `\n Total results : ${totalResults} people  
                                    \n Currently on Page : ${totalPagesShowInRelationToNmbrOfElmnts} out of ${totalPagesnRelationToNmbrOfElmnts} (${((totalPagesShowInRelationToNmbrOfElmnts / totalPagesnRelationToNmbrOfElmnts)) * 100} % has been shown) `);

                        break;

                    default:
                        break;
                }


                //Upon completing actually showing the results on screen we increase the pageCount 
                UIDataObject.increaseElementResultCount(numberOfElements);
            }
        });
    }
    static emptyDisplayedResultsContainer(personResultsContainerDiv) {
        let children = Array.from(personResultsContainerDiv.children);

        children.forEach((child) => {

            personResultsContainerDiv.removeChild(child);
        });
    }

    /** Creates a ruby-notation element with baseText as text on the line, and roof text raised above this text. 
     * Both texts are wrapped in p-elements inside a div with a query selector : .ruby_div
     * 
     * @param {string} baseText 
     * @param {string} roofText 
     * @param {HTMLElement} parentElement 
     */
    static createRubyNotationText(baseText, roofText, parentElement) {
        //We create a div to make rubytext a block element
        let rubyDiv = document.createElement("div");
        rubyDiv.setAttribute("class", "ruby_div");



        let movieResulttitleHeader = document.createElement("p");
        movieResulttitleHeader.innerText = ("text", baseText);

        let movieResultTimeHeader = document.createElement("p");
        movieResultTimeHeader.innerText = ("text", roofText);

        let rubyElement = document.createElement("ruby");
        let rpElementOpening = document.createElement("rp");
        let rpElementClosing = document.createElement("rp");
        rpElementOpening.append("(");
        rpElementClosing.append(")");
        let rtElement = document.createElement("rt");
        rubyElement.append(movieResulttitleHeader);
        rubyElement.append(rpElementOpening);
        rtElement.append(movieResultTimeHeader);
        rubyElement.append(rtElement);
        rubyElement.append(rpElementClosing);
        console.log(rubyElement);
        rubyDiv.append(rubyElement);
        parentElement.prepend(rubyDiv);
    }

    /** Make picture elements containing the source sets of the movieResults passed to the function and
     * append these to the parent element specified in the function
     * 
     * @param {Array<ApiClient.movieResult> || Array<ApiClient.PersonResult || Array<ApiClient.TvSeriesResult>} results: The objects we want to get images for 
     * @param {HTMLElement} parentElement : The parent where we want to post our collection of pictures
     * @param {int} STATIC_IMAGE_INT_PREFERRED_IMAGE_TYPE : via URLGenerator static ints for images, -1 represents getting all available 
     * picture types and showing them in the parent 
     * @returns {Array<HTMLDivElement>} : in order with the collection movieResults. Furthermore each div is given
     * an id such that : movieResultContainerDiv.setAttribute("id", 'movie_result-' + index)
     * @param {number | null} numberOfElements : if the numberOfElements can´t pass if(numberOfElements), all available elements are presented 
     */
    static showImagesForResult(results, parentElement, STATIC_IMAGE_INT_PREFERRED_IMAGE_TYPE, numberOfElements) {
        //If we have a specified number we want to make an array that fits that size
        let returnDivs;
        let resultsToPost;
        if (numberOfElements) {
            returnDivs = new Array(+numberOfElements);
            resultsToPost = results.slice(URLGenerator.pageVariables.nextPageCount, (+numberOfElements + URLGenerator.pageVariables.nextPageCount));

        } else {
            returnDivs = new Array(results.length);
            resultsToPost = results;
        }




        presentResults();

        //After iterating all over the results and showing their images, we can now return our completed returnDivs array

        return returnDivs;

        function presentResults() {
            resultsToPost.forEach((result, index) => {
                //for each movie result we want one combined picture element in a div
                let imageSourceArray = new Array(result.value.imageObject.pathArray.length);
                //getImage urls from pathArray
                if (STATIC_IMAGE_INT_PREFERRED_IMAGE_TYPE == -1) {
                    result.imageObject.pathArray.forEach((path, index) => {
                        //backdrop images on 0, poster on 1, then it will hold a number of urls per index
                        if (path) {
                            let tempObject = {
                                urlStrings: path,
                                mediaPresets: URLGenerator.getWidthArrayForImageType(index)
                            };
                            imageSourceArray[index] = tempObject;
                        }
                    }
                    );
                }
                else {

                    let tempObject = {
                        urlStrings: result.value.imageObject.pathArray[STATIC_IMAGE_INT_PREFERRED_IMAGE_TYPE],
                        mediaPresets: URLGenerator.getWidthArrayForImageType(STATIC_IMAGE_INT_PREFERRED_IMAGE_TYPE)
                    };
                    imageSourceArray = Array.of(tempObject);

                }


                //With our obtained first backdrop, then poster paths we now assign and append sources to the picture source tag
                //this loops over our collection of sourceUrls for a) backdrops b) posters
                for (let j = 0; j < imageSourceArray.length; j++) {
                    let pictureElement = document.createElement("picture");

                    for (let i = imageSourceArray[j].urlStrings.length - 1; i > 0; i--) {
                        let pictureSource = document.createElement("source");
                        pictureSource.setAttribute("srcset", imageSourceArray[j].urlStrings[i]);
                        pictureSource.setAttribute("media", imageSourceArray[j].mediaPresets[i]);

                        pictureElement.append(pictureSource);

                    }
                    //for last element we should have a img-tag as fallback 
                    let fallBackImg = document.createElement("img");
                    fallBackImg.setAttribute("src", "../../static_assets/no-image-svgrepo-com.png");
                    pictureElement.append(fallBackImg);


                    /*We place the resulting picture element in a div */
                    let movieResultContainerDiv = document.createElement("div");
                    movieResultContainerDiv.setAttribute("class", "displayed_result_div");
                    movieResultContainerDiv.setAttribute("id", 'displayed_result-' + index);
                    movieResultContainerDiv.append(pictureElement);


                    //Add eventlistener to show extended movie information on click
                    setOnClickForResultPicture(pictureElement, movieResultContainerDiv, result);

                    returnDivs[index] = movieResultContainerDiv;







                }

                //upon exit of the for-loop we have made all picture elements and we place each image in a div to group it with
                //title and release date. An array of these divs are returned upon completion so we can iterate over them
                parentElement.append(returnDivs[index]);
            });

            function setOnClickForResultPicture(pictureElement, movieResultContainerDiv, result) {



                const selectedResultbackgroundDiv = document.createElement("div");
                selectedResultbackgroundDiv.setAttribute("id", "focused_background_div");

                pictureElement.addEventListener("click", () => {

                    let navHeading = document.createElement("h2");
                    navHeading.setAttribute("id", "nav_result_title");




                    if (result.value instanceof ApiClient.MovieResult) {

                        navHeading.innerText = result.value.title;

                    }
                    else if (result.value instanceof ApiClient.PersonResult) {

                        navHeading.innerText = result.value.name + ` (${result.value.knownFor.department})`;

                    }
                    else if (result.value instanceof ApiClient.tvSeriesResult) {

                        navHeading.innerText = result.value.name;

                    }
                    const mainContent = document.getElementById("main_div");
                    let copyOfResultDiv = document.createElement("div");
                    copyOfResultDiv.innerHTML = movieResultContainerDiv.innerHTML;
                    copyOfResultDiv.setAttribute("id", "result_focused_div");
                    if (result.value instanceof ApiClient.MovieResult || result.value instanceof ApiClient.tvSeriesResult) {
                        copyOfResultDiv.style = ` background-image: url('${result.value.imageObject.pathArray[0][result.value.imageObject.pathArray[0].length - 1]})`;
                    }
                    else if (result.value instanceof ApiClient.PersonResult && result.value.knownFor.media) {
                        // we choose a random of the person´s known for media as a backdrop
                        let randIndex = Math.round(Math.random() * (result.value.knownFor.media.length - 1));
                        let imageObject = new ApiClient.ImageObject(result.value.knownFor.media[randIndex]);
                        // if the resulting imageObject does not have a backdrop url we try again
                        while (!(imageObject.pathArray[0])) {
                            randIndex = Math.round(Math.random() * (result.value.knownFor.media.length - 1));

                            imageObject = new ApiClient.ImageObject(result.value.knownFor.media[randIndex]);
                        }
                        copyOfResultDiv.style = ` background-image: url('${imageObject.pathArray[0][1]})`;


                    }
                    let detailsDiv = document.createElement("div");
                    detailsDiv.setAttribute("id", "on_focused_details_wrapper_div")


                    if (result.value instanceof ApiClient.PersonResult) {


                        setUpPersonDetailsInProvidedParent(result.value, detailsDiv, copyOfResultDiv);
                    }

                    else if (result.value instanceof ApiClient.MovieResult) {


                        setUpMovieElementInProvidedParent(result, copyOfResultDiv, detailsDiv);
                    }


                    if (result.value instanceof ApiClient.tvSeriesResult) {
                        const tvResult = result.value;

                        let nav = document.getElementById("navigation_menu");
                        let resultText;
                        let counter = 0;
                        let keyArray = [];
                        resultText = tvResult.name;


                        let h4Heading = document.createElement("h4");
                        resultText = tvResult.name;
                        if (tvResult.original_name && tvResult.original_name != tvResult.name) {
                            resultText += `(${tvResult.originalTitle})`;
                        }
                        h4Heading.innerText = resultText;
                        let h5Heading = document.createElement("h5");
                        resultText = "";
                        //We create a string from the genres and or tagline
                        if (tvResult.tagline && tvResult.genres) {
                            resultText += tvResult.tagline + "\n Genres : " + tvResult.genres.map((genre) => genre.name);
                        }
                        else if (tvResult.genres) {
                            resultText += `Genres : ${tvResult.genres.map((genre) => genre.name)}`;
                        }

                        else if (tvResult.tagline) {
                            resultText += tvResult.tagline;
                        }
                        h5Heading.innerText = resultText;
                        copyOfResultDiv.append(h4Heading, h5Heading);

                        /*                                                     "Creators : " : tvResult.created_by,
                         */


                        if (tvResult.overview) {
                            let overviewDetailElement = document.createElement("details");
                            let overviewSummaryElement = document.createElement("summary");
                            overviewDetailElement.innerText = tvResult.overview;
                            overviewSummaryElement.innerText = "Overview :";

                            overviewDetailElement.append(overviewSummaryElement);
                            detailsDiv.append(overviewDetailElement);

                        }






                        if (tvResult.popularityObject) {
                            keyArray = ["Popularity score : ", "Vote average : ", "Vote count: "];
                            resultText = "";
                            counter = 0;
                            for (const key in tvResult.popularityObject) {
                                if (tvResult.popularityObject[key]) {
                                    keyArray[counter] += tvResult.popularityObject[key];
                                    resultText += keyArray[counter] + "\n";

                                }
                                counter++;
                            }
                        }



                        let popularityDetailElement = document.createElement("details");
                        let popularitySummaryElement = document.createElement("summary");
                        popularityDetailElement.innerText = resultText;
                        popularitySummaryElement.innerText = "Popularity ratings";

                        popularityDetailElement.append(popularitySummaryElement);
                        detailsDiv.append(popularityDetailElement);







                        let productionObject = {
                            "Networks : ": tvResult.networks.map((promise) => promise.value),
                            "Production Companies :": tvResult.production_companies,
                            "In Production : ": tvResult.currentBroadcastStatus,
                            "Next episode to air : ": tvResult.next_episode_to_air,
                            "Last episode to air : ": tvResult.last_episode_to_air,
                            "Total number of episodes :": tvResult.number_of_episodes,
                            "Total number of seansons : ": tvResult.number_of_seasons,
                            "First air date : ": tvResult.timeObject.firstAirDate,
                            "Last air date : ": tvResult.timeObject.lastAirDate,









                        }

                        if (productionObject) {
                            let productionDetailElement = document.createElement("details");
                            let productionSummaryElement = document.createElement("summary");

                            productionSummaryElement.innerText = "Production";

                            productionDetailElement.append(productionSummaryElement);

                            keyArray = Object.keys(productionObject);
                            resultText = "";
                            counter = 0;
                            for (const key in productionObject) {
                                if (productionObject[key]) {


                                    if (key == "Networks : ") {
                                        let networkArray;
                                        //We can have several networks for any given tv series, so we must loop through them
                                        if (!Array.isArray(productionObject[key])) {
                                            networkArray = Array.of(productionObject[key]);


                                        } else {
                                            networkArray = productionObject[key];
                                        }

                                        let networkCollectionDetailsElement = document.createElement("details");
                                        let networkCollectionSummaryElement = document.createElement("summary");
                                        networkCollectionSummaryElement.innerText = "Networks : ";
                                        networkCollectionDetailsElement.append(networkCollectionSummaryElement);


                                        networkArray.forEach((network) => {
                                            let networkKeyArray = Object.keys(network).filter((key) => key != "id");

                                            let networkCounter = 0;

                                            let networkPresentationKeyArray = ["Headquarters situated in: ", "Originating from : "]


                                            let networkDetailElement = document.createElement("details");


                                            let networkDetailText = "";

                                            for (const networkKey of networkKeyArray) {

                                                if (network[networkKey] && networkKey == "homepage") {
                                                    presentHomePageLink(network[networkKey], networkDetailElement);

                                                } else if (network[networkKey] && networkKey == "name") {

                                                    const networkName = network[networkKey];
                                                    let networkSummaryElement = document.createElement("summary");
                                                    networkSummaryElement.innerText = networkName;
                                                    networkDetailElement.append(networkSummaryElement);
                                                }
                                                else if (network[networkKey] && networkKey == "imageObject") {


                                                    let pictureElement = pictureElementFromUrl(4, network.imageObject.pathArray);
                                                    networkDetailElement.append(pictureElement);



                                                }
                                                else {
                                                    //Make sure the attribute exists before we write it to the element
                                                    if (network[networkKey]) {
                                                        networkDetailText += networkPresentationKeyArray[networkCounter] + network[networkKey] + "\n";
                                                        networkCounter++;
                                                    }
                                                }



                                            }
                                            //After completing the loop we have all the element




                                            /*We place the resulting picture element in a div */
                                            /* let networkResultContainerDiv = document.createElement("div");
                                            networkResultContainerDiv.setAttribute("class", "displayed_network_div");
                                            networkResultContainerDiv.setAttribute("id", 'displayed_network_result'); */
                                            let networkTextElement = document.createElement("p");
                                            networkTextElement.innerText = networkDetailText;
                                            networkDetailElement.append(networkTextElement);
                                            networkCollectionDetailsElement.append(networkDetailElement);

                                        });
                                        productionDetailElement.append(networkCollectionDetailsElement);


                                    }
                                    else if (key == "Production Companies :") {

                                        let prodCompanyArray;
                                        //We can have several prodCompanys for any given tv series, so we must loop through them
                                        if (!Array.isArray(productionObject[key])) {
                                            prodCompanyArray = Array.of(productionObject[key]);

                                        }
                                        else {
                                            prodCompanyArray = productionObject[key];
                                        }

                                        //Make a details element to group all production companies in
                                        let prodCompanyCollectionDetailsElement = document.createElement("details");
                                        let prodCompanyCollectionSummaryElement = document.createElement("summary");
                                        prodCompanyCollectionSummaryElement.innerText = "Production companies : ";
                                        prodCompanyCollectionDetailsElement.append(prodCompanyCollectionSummaryElement);

                                        prodCompanyArray.forEach((prodCompany, prodCompanyIndex) => {
                                            let prodCompanyKeyArray = Object.keys(prodCompany).filter((key) => key != "id");

                                            let prodCompanyText = document.createElement("p");

                                            let prodCompanyDetailElement = document.createElement("details");

                                            let prodCompanyName = prodCompany.name;
                                            let prodCompanySummaryElement = document.createElement("summary");
                                            prodCompanySummaryElement.innerText = prodCompanyName;
                                            prodCompanyDetailElement.append(prodCompanySummaryElement);



                                            if (prodCompany["origin_country"]) {
                                                let originCountryString = `Country of origin : +${prodCompany["origin_country"]} `
                                                prodCompanyText.innerText = originCountryString + "\n";
                                                prodCompanyDetailElement.append(prodCompanyText);
                                            }

                                            if (prodCompany.imageObject) {


                                                prodCompany.imageObject.pathArray.forEach((path, index) => {
                                                    if (path) {



                                                        let pictureElement = pictureElementFromUrl(index, path);
                                                        prodCompanyDetailElement.append(pictureElement);

                                                    }
                                                });
                                            }

                                            //All attributes assigned

                                            prodCompanyCollectionDetailsElement.append(prodCompanyDetailElement);


                                        });














                                        productionDetailElement.append(prodCompanyCollectionDetailsElement);




                                    }
                                    else if (key == "Shot/Made In : ") {

                                        resultText += key + productionObject[key]["englishName"];
                                    }
                                    else {

                                        resultText += key + productionObject[key];

                                    }
                                    resultText += "\n";

                                }

                            }
                            let text = document.createElement("p");
                            text.innerText = resultText;
                            productionDetailElement.prepend(text);
                            detailsDiv.append(productionDetailElement);

                            //details of cast and crew
                            if (tvResult.cast || tvResult.crew || tvResult.created_by) {
                                let castAndCrewDetailElement = document.createElement("details");
                                let castAndCrewSummaryElement = document.createElement("summary");
                                castAndCrewSummaryElement.innerText = "Cast & Crew: ";
                                if (tvResult.created_by) {
                                    let creatorsDetailsElement = creatorsDetailsElementFromTvResult(tvResult);
                                    //We add the section to the cast and crew details element
                                    castAndCrewDetailElement.append(creatorsDetailsElement);


                                }

                                //We check for cast and do the same ; All CrewMembers and Castmembers are subclasses of PersonResult

                                if (tvResult.cast) {
                                    let castDetailsElement = castDetailsFromResult(tvResult);

                                    //We add the section to the cast and crew details element
                                    castAndCrewDetailElement.append(castDetailsElement);


                                }
                                if (tvResult.crew) {
                                    let crewDetailsElement = crewDetailsElementFromTvResult(tvResult);

                                    //We add the section to the cast and crew details element
                                    castAndCrewDetailElement.append(crewDetailsElement);


                                }



                                castAndCrewDetailElement.prepend(castAndCrewSummaryElement);
                                detailsDiv.append(castAndCrewDetailElement);
                            }

                            if (tvResult.seasons) {

                                let seasonCollectionDetailsElement = document.createElement("details");
                                let seasonCollectionSummaryElement = document.createElement("summary");

                                seasonCollectionSummaryElement.innerText = "Seasons : ";
                                seasonCollectionDetailsElement.append(seasonCollectionSummaryElement);

                                tvResult.seasons.forEach((season, index) => {

                                    let seasonDetailsElement = document.createElement("details");
                                    let seasonSummaryElement = document.createElement("summary");

                                    seasonSummaryElement.innerText = "Season  " + (index + 1);
                                    seasonDetailsElement.append(seasonSummaryElement);

                                    //Loop through all of the keys and print them except the episodes


                                    if (season.overview) {

                                        let overviewParagraph = document.createElement("p");
                                        document.innerText = season.overview;
                                        seasonDetailsElement.append(overviewParagraph);


                                    }
                                    if (season.imageObject) {
                                        pictureFromImageObjectInParentElement(season, seasonDetailsElement);



                                    }
                                    if (season.air_date) {
                                        let airDateeParagraph = document.createElement("p");
                                        document.innerText = "Air date : " + season.air_date;
                                        seasonDetailsElement.append(airDateeParagraph);


                                    }

                                    if (season.vote_average) {
                                        let voteAverageParagraph = document.createElement("p");
                                        document.innerText = "Vote Average : " + season.vote_average;
                                        seasonDetailsElement.append(voteAverageParagraph);

                                    }

                                    season.episodes.forEach((episode, index) => {


                                        let episodeDetailsElement = document.createElement("details");
                                        let episodeSummaryElement = document.createElement("summary");

                                        episodeSummaryElement.innerText = "Episode : " + (index + 1);
                                        episodeDetailsElement.append(episodeSummaryElement);

                                        if (episode.imageObject) {
                                            pictureFromImageObjectInParentElement(episode, episodeDetailsElement);



                                        }

                                        if (episode.timeObject.runtime || episode.timeObject.airDate) {

                                            let paragraphText = "";

                                            /*.timeObject = {
                                              airDate: json.air_date,
                                              runtime: json.runtime
                                          }; */

                                            // To convert runtimme to hours we see what the remainder is when dividing with 60. Subtracting this from the runtime will give us the closest value 
                                            // divisible by 60
                                            if (episode.timeObject.runtime) {
                                                let totalRunTimeString = `${episode.timeObject.runtime} minutes`;
                                                if (episode.timeObject.runtime > 60) {
                                                    let remainderOfRuntimeInHours = episode.timeObject.runtime % 60;
                                                    let runtimeInHours = (episode.timeObject.runtime - remainderOfRuntimeInHours) / 60;
                                                    totalRunTimeString = runtimeInHours + "hours & " + remainderOfRuntimeInHours + " minutes\n";
                                                    paragraphText += totalRunTimeString;
                                                }
                                            }
                                            if (episode.timeObject.airDate) {
                                                paragraphText += "Air date : " + episode.timeObject.airDate;

                                            }

                                            let timeObjectParagraph = document.createElement("p");
                                            timeObjectParagraph.innerText = paragraphText
                                            episodeDetailsElement.append(timeObjectParagraph);



                                        }





                                        if (episode.cast || episode.crew || episode.guestStars) {

                                            let castAndCrewForEpisodeDetailElement = document.createElement("details");
                                            let castAndCrewForEpisodeSummaryElement = document.createElement("summary");
                                            castAndCrewForEpisodeSummaryElement.innerText = "Cast & Crew: ";


                                            if (episode.cast) {
                                                let castDetails = castDetailsFromResult(episode);
                                                castAndCrewForEpisodeDetailElement.append(castDetails);
                                            }
                                            else {
                                                if (tvResult.cast) {

                                                    let castDetails = castDetailsFromResult(tvResult);

                                                    castAndCrewForEpisodeDetailElement.append(castDetails);


                                                }

                                            }

                                            if (episode.crew) {
                                                let crewDetails = crewDetailsElementFromTvResult(episode);

                                                castAndCrewForEpisodeDetailElement.append(crewDetails);
                                            }
                                            if (episode.guestStars) {
                                                let guestStarsDetails = guestStarDetailsFromResult(episode);

                                                castAndCrewForEpisodeDetailElement.append(guestStarsDetails);
                                            }

                                            episodeDetailsElement.append(castAndCrewForEpisodeDetailElement);
                                        }

                                        if (episode.popularityObject) {

                                            let popularityDetailsElement = popularityDetailsFromResult(episode);
                                            episodeDetailsElement.append(popularityDetailsElement);
                                        }


                                        //Now we have all the episodes for the season on the for-loop and
                                        //we have also gone through the attributes in 1 season, so we can add
                                        //the seasons seasondetailsElement to the tvSeriesDetailsElement

                                        seasonDetailsElement.append(episodeDetailsElement);

                                        seasonCollectionDetailsElement.append(seasonDetailsElement);




                                    });





                                });


                                //We have completed the iteration through our seasonObjects and can add the seasonCollection
                                //to the detailsDiv

                                detailsDiv.append(seasonCollectionDetailsElement);



                            }

                        }
                        /*  let remainderOfRuntimeInHours = tvResult-productionObject.runtime % 60;
                         let runtimeInHours = tvResult-productionObject.runtime - remainderOfRuntimeInHours / 60;
                         keyArray[counter] += `${runtimeInHours} hours, ${remainderOfRuntimeInHours} minutes (` + tvResult-productionObject[key] + " minutes )"; */
                    }



                    /*  let castAndCrewDetailElement = document.createElement("details");
                    let castAndCrewSummaryElement = document.createElement("summary");
                    castAndCrewSummaryElement.innerText = "Cast & Crew: "; */
                    /*                         ApiClient.tvSeriesResult.prototype.created_by
                     */
                    /*     let creatorsDetailsElement = document.createElement("details");
                        let creatorsSummaryElement = document.createElement("summary");
                        creatorsSummaryElement.innerText = "Created by : ";
                        
 
                    
 
                        castAndCrewDetailElement.append(castAndCrewSummaryElement);
                        detailsDiv.append(castAndCrewDetailElement); */


                    copyOfResultDiv.append(detailsDiv);





/*                       const backDropUrls = result.value.imageObject.pathArray[0];
 */                mainContent.prepend(selectedResultbackgroundDiv);

                    /*                 copyOfResultDiv.style.backgroundImage = "url(\"" + backDropUrls[backDropUrls.length - 1] + "\")";
                     */
                    //create back button
                    let backButtonSvg = document.createElement("img");
                    /**fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            width="800px" height="800px" viewBox="0 0 199.404 199.404"
            xml:space="preserve" */
                    selectedResultbackgroundDiv.setAttribute("id", "focused_background_div");
                    selectedResultbackgroundDiv.setAttribute("class", "focused");
                    backButtonSvg.setAttribute("id", "back_button");
                    backButtonSvg.setAttribute("src", "https://www.svgrepo.com/show/51056/left-arrow-angle.svg");

                    /*   backButtonSvg.setAttribute("xmlns","http://www.w3.org/2000/svg");
                      backButtonSvg.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink" );
                      backButtonSvg.setAttribute( "width",selectedResultbackgroundDiv.attributes.classNode("width")*0.2+"px");
                      backButtonSvg.setAttribute( "height",selectedResultbackgroundDiv.attributes.classNode("height")*0.2+"px");
                      backButtonSvg.setAttribute("viewBox","0 0 199.404 199.404");
                      backButtonSvg.setAttribute( "xml:space","preserve");
                      const graphicsElement = document.createElement("g");
                      const arrowPolygon = document.createElement("polygon");
                      arrowPolygon.setAttribute("points", "135.412,0 35.709,99.702 135.412,199.404 163.695,171.119 92.277,99.702 163.695,28.285");
            
                     graphicsElement.append(arrowPolygon);
                     backButtonSvg.append(graphicsElement);
                     selectedResultbackgroundDiv.append(backButtonSvg); */
                    selectedResultbackgroundDiv.append(copyOfResultDiv);
                    let nav = document.getElementById("navigation_menu");
                    copyOfResultDiv.prepend(backButtonSvg);
                    nav.append(navHeading);

                    backButtonSvg.addEventListener("click", () => {

                        movieResultContainerDiv.setAttribute("class", "result_container_div result_div");
                        navHeading.remove();
                        selectedResultbackgroundDiv.remove();
                        backButtonSvg.remove();
                        Array.from(selectedResultbackgroundDiv.children).forEach((child) => {

                            child.remove();
                        })




                    });


                });





















            }

            function pictureFromImageObjectInParentElement(resultWithImageObject, detailsElement) {
                resultWithImageObject.imageObject.pathArray.forEach((path, index) => {

                    if (path) {
                        let resultWithImageObjectPictureElement = pictureElementFromUrl(index, path);

                        detailsElement.prepend(resultWithImageObjectPictureElement);
                    }
                });
            }

            function creatorsDetailsElementFromTvResult(tvResult) {
                let creatorsDetailsElement = document.createElement("details");
                let creatorsSummaryElement = document.createElement("summary");
                creatorsSummaryElement.innerText = "Created by : ";
                creatorsDetailsElement.append(creatorsSummaryElement);


                tvResult.created_by.forEach((creator) => {
                    //We create a details element for each creator
                    let creatorDetailsElement = document.createElement("details");
                    let creatorSummaryElement = document.createElement("summary");
                    creatorSummaryElement.innerText = creator.name;
                    creatorDetailsElement.append(creatorSummaryElement);



                    setUpPersonDetailsInProvidedParent(creator, creatorDetailsElement, creatorDetailsElement);

                    if (creator.imageObject) {
                        creator.imageObject.pathArray.forEach((path, index) => {

                            if (path) {
                                let creatorPictureElement = pictureElementFromUrl(index, path);

                                creatorDetailsElement.prepend(creatorPictureElement);
                            }
                        });

                    }

                });
                return creatorsDetailsElement;
            }

            function crewDetailsElementFromTvResult(tvResult) {
                let crewDetailsElement = document.createElement("details");
                let crewSummaryElement = document.createElement("summary");
                crewSummaryElement.innerText = "Crew : ";
                crewDetailsElement.append(crewSummaryElement);
                tvResult.crew.forEach((crewMember) => {
                    //We create a details element for each creator
                    let crewMemberDetailsElement = document.createElement("details");
                    let crewMemberSummaryElement = document.createElement("summary");
                    crewMemberSummaryElement.innerText = crewMember.name + " ( as : " + crewMember.job + ")";
                    crewMemberDetailsElement.append(crewMemberSummaryElement);



                    setUpPersonDetailsInProvidedParent(crewMember, crewMemberDetailsElement, crewDetailsElement);

                    if (crewMember.imageObject) {
                        crewMember.imageObject.pathArray.forEach((path, index) => {

                            if (path) {
                                let crewMemberPictureElement = pictureElementFromUrl(index, path);

                                crewMemberDetailsElement.prepend(crewMemberPictureElement);
                            }
                        });

                    }

                });
                return crewDetailsElement;
            }

            /**
             * 
             * @param {Result containing cast and crew (e.g TvSeriesResult, Episode, Season)} tvResult 
             * @returns 
             */
            function castDetailsFromResult(tvResult) {
                let castDetailsElement = document.createElement("details");
                let castSummaryElement = document.createElement("summary");
                castSummaryElement.innerText = "Cast : ";
                castDetailsElement.append(castSummaryElement);
                tvResult.cast.forEach((castMember) => {
                    //We create a details element for each creator
                    let castMemberDetailsElement = document.createElement("details");
                    let castMemberSummaryElement = document.createElement("summary");
                    castMemberSummaryElement.innerText = castMember.name + "  (As the character : " + castMember.character + ")";
                    castMemberDetailsElement.append(castMemberSummaryElement);



                    setUpPersonDetailsInProvidedParent(castMember, castMemberDetailsElement, castDetailsElement);

                    if (castMember.imageObject) {
                        castMember.imageObject.pathArray.forEach((path, index) => {

                            if (path) {
                                let castMemberPictureElement = pictureElementFromUrl(index, path);

                                castMemberDetailsElement.prepend(castMemberPictureElement);
                            }
                        });

                    }

                });
                return castDetailsElement;
            }
            /**
             * 
             * @param {Result containing cast and crew (e.g TvSeriesResult, Episode, Season)} tvResult 
             * @returns 
             */
            function guestStarDetailsFromResult(tvResult) {
                let castDetailsElement = document.createElement("details");
                let castSummaryElement = document.createElement("summary");
                castSummaryElement.innerText = "Guest stars : ";
                castDetailsElement.append(castSummaryElement);
                tvResult.guestStars.forEach((castMember) => {
                    //We create a details element for each creator
                    let castMemberDetailsElement = document.createElement("details");
                    let castMemberSummaryElement = document.createElement("summary");
                    castMemberSummaryElement.innerText = castMember.name + "  (As the character : " + castMember.character + ")";
                    castMemberDetailsElement.append(castMemberSummaryElement);



                    setUpPersonDetailsInProvidedParent(castMember, castMemberDetailsElement, castDetailsElement);

                    if (castMember.imageObject) {
                        castMember.imageObject.pathArray.forEach((path, index) => {

                            if (path) {
                                let castMemberPictureElement = pictureElementFromUrl(index, path);

                                castMemberDetailsElement.prepend(castMemberPictureElement);
                            }
                        });

                    }

                });
                return castDetailsElement;
            }

            /**
             * @param @requires {int} STATIC_IMAGE_INT_PREFERRED_IMAGE_TYPE
             * @param @requires {URLGenerator.getImageUrls() -result} urls 
             * @returns {HTMLPictureElement} result
             */
            function pictureElementFromUrl(STATIC_IMAGE_INT_PREFERRED_IMAGE_TYPE, urls) {

                let tempObject = {
                    urlStrings: urls,
                    mediaPresets: URLGenerator.getWidthArrayForImageType(STATIC_IMAGE_INT_PREFERRED_IMAGE_TYPE)
                };




                let pictureElement = document.createElement("picture");

                for (let i = tempObject.urlStrings.length - 1; i > 0; i--) {
                    let pictureSource = document.createElement("source");
                    pictureSource.setAttribute("srcset", tempObject.urlStrings[i]);
                    pictureSource.setAttribute("media", tempObject.mediaPresets[i]);

                    pictureElement.append(pictureSource);

                }
                //for last element we should have a img-tag as fallback 
                let fallBackImg = document.createElement("img");
                fallBackImg.setAttribute("src", tempObject.urlStrings[0]);
                pictureElement.append(fallBackImg);

                return pictureElement;
            }

            /**
            * @param {ApiClient.PersonResult} result 
            * @param {HTMLDivElement} parentElement : Our copyOfresultsDiv -> The copy of the result we click on the picture for 
            * @param {HTMLDivElement} childElement : Where we want to place the information inside of the parent element 
            */
            function setUpPersonDetailsInProvidedParent(result, detailsDiv, copyOfResultDiv) {
                if (result instanceof ApiClient.PersonResult) {
                    let keyArray = ["Vote count : ", "Vote average : ", "Popularity score : "];
                    let resultText = "";
                    let counter = 0;
                    console.log("is a person");

                    const personResult = result;


                    ;


                    let nameHeading = document.createElement("h4");
                    nameHeading.innerText = personResult.name;
                    let akaHeading = document.createElement("h5");
                    akaHeading.innerText = personResult.alsoKnownAs;

                    if (personResult.popularityObject) {
                        let popularityDetailElement = popularityDetailsFromResult(personResult);
                        detailsDiv.append(popularityDetailElement);

                    }


                    if (personResult.knownFor.media) {

                        let knownForDetailElement = document.createElement("details");
                        let knownForSummaryElement = document.createElement("summary");

                        knownForSummaryElement.innerText = "Known for: ";
                        personResult.knownFor.media.forEach((media) => {
                            //create div inside of the known for details element
                            let mediaDiv = document.createElement("div");
                            //create the picture element of the movie or series
                            let pictureOfMedia = pictureElementFromUrl(1, URLGenerator.getImageUrls(1, media["poster_path"]));
                            let titleh5 = document.createElement("h5");
                            if (media["media_type"] == "movie") {
                                titleh5.innerText = `${media["title"]} (Movie)`;
                            }
                            else if (media["media_type"] == "tv") {
                                titleh5.innerText = `${media["name"]} (Tv-show)`;




                            }
                            let informationParagraph = document.createElement("p");
                            if (media["release_date"] || media["original_title"]) {
                                informationParagraph.innerText = `Release date : ${media["release_date"]} \n `;

                                if ((media["original_title"] != media["title"]) && (media["original_title"])) {
                                    informationParagraph.innerText += `Original title : ${media["original_title"]}`
                                }
                            }

                            mediaDiv.append(titleh5);
                            mediaDiv.append(pictureOfMedia);
                            mediaDiv.append(informationParagraph);
                            knownForDetailElement.append(mediaDiv);


                        });

                        knownForDetailElement.append(knownForSummaryElement);
                        detailsDiv.append(knownForDetailElement);

                    }
                    //Makes an object with presentable attribute names to stringify
                    let personalObject = {
                        Biography: personResult.biography,
                        Birthplace: personResult.placeOfBirth,
                        Birthday: personResult.birthday,
                        Deathday: personResult.deathday,
                        Gender: personResult.gender
                    };

                    keyArray = ["Biography: ",
                        "Birthplace: ",
                        "Birthday: ",
                        "Deathday: ",
                        "Gender: "
                    ];
                    counter = 0;
                    resultText = "";
                    for (const key in personalObject) {
                        if (personalObject[key]) {


                            keyArray[counter] += personalObject[key];
                            resultText += keyArray[counter] + "\n";

                        } else if (personalObject[key] == null) {
                            keyArray[counter] += "Not known";
                            resultText += keyArray[counter] + "\n";

                        }
                        counter++;
                    }

                    //link to their home page
                    if (personResult.homePageURL) {
                        presentHomePageLink(personResult.homePageURL, detailsDiv);
                    }

                    let personalDetailElement = document.createElement("details");
                    let personalSummaryElement = document.createElement("summary");
                    personalDetailElement.innerText = resultText;
                    personalSummaryElement.innerText = "Personal: ";

                    personalDetailElement.append(personalSummaryElement);
                    detailsDiv.append(personalDetailElement);

                    copyOfResultDiv.append(detailsDiv);




                    /* let popularityDetailElement = document.createElement("details");
                    let popularitySummaryElement = document.createElement("summary"); */





                }
            }
            function popularityDetailsFromResult(result) {
                let popularityDetailElement = document.createElement("details");
                let popularitySummaryElement = document.createElement("summary");
                let detailText;
                let keyArray = ["Vote count : ", "Vote average : ", "Popularity score : "];
                let resultText = "";
                let counter = 0;
                for (const key in result.popularityObject) {
                    if (result.popularityObject[key]) {
                        keyArray[counter] += result.popularityObject[key];
                        resultText += keyArray[counter] + "\n";

                    }
                    counter++;
                }
                popularityDetailElement.innerText = resultText;
                popularitySummaryElement.innerText = "Popularity ratings";

                popularityDetailElement.append(popularitySummaryElement);
                return popularityDetailElement;
            }

            /**
             * 
             * @param {URL} url 
             * @param {HTMLElement} parentElement - > The parent in which the link should be appended
             */
            function presentHomePageLink(url, parentElement) {
                let homePageLink = document.createElement("a");
                homePageLink.innerText = url.href;
                homePageLink.href = url;
                parentElement.prepend(homePageLink);
            }

            /**
             * @param {any} result : the result to be presented 
             * @param {HTMLDivElement} parentElement : Our copyOfresultsDiv -> The copy of the result we click on the picture for 
             * @param {HTMLDivElement} childElement : Where we want to place the information inside of the parent element 
             */
            function setUpMovieElementInProvidedParent(result, copyOfResultDiv, detailsDiv) {
                if (result.value instanceof ApiClient.MovieResult) {

                    const movieResult = result.value;
                    let resultText;


                    let h4Heading = document.createElement("h4");
                    let counter = 0;
                    let keyArray = [];
                    resultText = movieResult.title;
                    if (movieResult.originalTitle && movieResult.originalTitle != movieResult.title) {
                        resultText += `(${movieResult.originalTitle})`;
                    }
                    h4Heading.innerText = resultText;
                    let h5Heading = document.createElement("h5");
                    resultText = "";
                    if (movieResult.tagline || movieResult.movieGenreArray) {

                        if (movieResult.tagline) {
                            resultText += movieResult.tagline + "\n";
                        }
                        else if (movieResult.movieGenreArray) {

                            movieResult.movieGenreArray.forEach((arrayElement, index) => {
                                switch (index) {
                                    case movieResult.movieGenreArray.length - 1:
                                        resultText += arrayElement.genreName + "\n";


                                        break;

                                    default:
                                        resultText += arrayElement.genreName + ", ";

                                        break;
                                }




                            });
                        }
                    }


                    h5Heading.innerText = resultText;
                    copyOfResultDiv.append(h4Heading, h5Heading);

                    if (movieResult.overview) {
                        let overviewDetailElement = document.createElement("details");
                        let overviewSummaryElement = document.createElement("summary");
                        overviewDetailElement.innerText = movieResult.overview;
                        overviewSummaryElement.innerText = "Overview :";

                        overviewDetailElement.append(overviewSummaryElement);
                        detailsDiv.append(overviewDetailElement);

                    }






                    if (movieResult.popularityObject) {
                        keyArray = ["Popularity score : ", "Vote average : ", "Vote count: "];
                        resultText = "";
                        counter = 0;
                        for (const key in movieResult.popularityObject) {
                            if (movieResult.popularityObject[key]) {
                                keyArray[counter] += movieResult.popularityObject[key];
                                resultText += keyArray[counter] + "\n";

                            }
                            counter++;
                        }
                    }



                    let popularityDetailElement = document.createElement("details");
                    let popularitySummaryElement = document.createElement("summary");
                    popularityDetailElement.innerText = resultText;
                    popularitySummaryElement.innerText = "Popularity ratings";

                    popularityDetailElement.append(popularitySummaryElement);
                    detailsDiv.append(popularityDetailElement);

                    if (movieResult.movieTimeObject) {

                        counter = 0;
                        resultText = "";
                        keyArray = ["Premier date : ", "Runtime : ", "Has been released : "];
                        resultText = "";
                        counter = 0;
                        for (const key in movieResult.movieTimeObject) {
                            if (movieResult.movieTimeObject[key]) {
                                if (key == "runtime") {
                                    if (movieResult.movieTimeObject.runtime > 60) {
                                        let remainderOfRuntimeInHours = movieResult.movieTimeObject.runtime % 60;
                                        let runtimeInHours = (movieResult.movieTimeObject.runtime - remainderOfRuntimeInHours) / 60;
                                        keyArray[counter] += `${runtimeInHours} hours, ${remainderOfRuntimeInHours} minutes (` + movieResult.movieTimeObject[key] + " minutes )";
                                    }
                                    else {

                                        keyArray[counter] += movieResult.movieTimeObject[key] + " minutes )";

                                    }

                                }
                                else {

                                    keyArray[counter] += movieResult.movieTimeObject[key];

                                }
                                resultText += keyArray[counter] + "\n";

                            }
                            counter++;
                        }
                    }

                    let infoObject = {
                        "Genres : ": movieResult.movieGenreArray,
                        "Budget : ": movieResult.movieEconomy.budget,
                        "Revenure : ": movieResult.movieEconomy.revenue,
                        "Profit : ": movieResult.movieEconomy.profit,
                        "Original language(s) : ": movieResult.movieLanguageObject.originalLanguage,
                        "Spoken language(s) :": movieResult.movieLanguageObject.spokenLanguagesArray
                    };


                    if (infoObject) {


                        keyArray = Object.keys(infoObject);
                        counter = 0;
                        for (const key in infoObject) {
                            if (infoObject[key] && key != "Genres : " &&
                                !key.includes("Spoken language(s) :")) {
                                keyArray[counter] += infoObject[key];
                                resultText += keyArray[counter] + "\n";

                            }
                            else if (key == "Genres : ") {
                                infoObject[key].forEach((arrayElement, index) => {
                                    switch (index) {
                                        case infoObject[key].length - 1:
                                            keyArray[counter] += arrayElement.genreName;


                                            break;

                                        default:
                                            keyArray[counter] += arrayElement.genreName + ", ";

                                            break;
                                    }




                                });

                                resultText += keyArray[counter] + "\n";

                            }
                            else if (key.includes("Spoken language(s) :")) {

                                infoObject[key].forEach((arrayElement, index) => {
                                    switch (index) {
                                        case infoObject[key].length - 1:
                                            keyArray[counter] += arrayElement.englishName;

                                            break;

                                        default:
                                            keyArray[counter] += arrayElement.englishName + ", ";

                                            break;
                                    }

                                });
                            }
                            counter++;
                        }

                        let infoDetailElement = document.createElement("details");
                        let infoSummaryElement = document.createElement("summary");
                        infoDetailElement.innerText = resultText;
                        infoSummaryElement.innerText = "Information : ";

                        infoDetailElement.append(infoSummaryElement);
                        detailsDiv.append(infoDetailElement);

                    }

                    if (movieResult.collectionObjectArray) {

                        let collectionDetailElement = document.createElement("details");
                        let collectionSummaryElement = document.createElement("summary");
                        collectionDetailElement.innerText = movieResult.collectionObjectArray.name;
                        collectionSummaryElement.innerText = "Included in collection(s) : ";
                        let imageSourceArray = new Array(movieResult.collectionObjectArray.imageObject.pathArray.length);
                        movieResult.collectionObjectArray.imageObject.pathArray.forEach((path, index) => {
                            //backdrop images on 0, poster on 1, then it will hold a number of urls per index
                            if (path) {
                                let tempObject = {
                                    urlStrings: path,
                                    mediaPresets: URLGenerator.getWidthArrayForImageType(index)
                                };
                                imageSourceArray[index] = tempObject;
                            }
                        }
                        );
                        for (let j = 0; j < imageSourceArray.length; j++) {
                            let pictureElement = document.createElement("picture");

                            for (let i = imageSourceArray[j].urlStrings.length - 1; i > 0; i--) {
                                let pictureSource = document.createElement("source");
                                pictureSource.setAttribute("srcset", imageSourceArray[j].urlStrings[i]);
                                pictureSource.setAttribute("media", imageSourceArray[j].mediaPresets[i]);

                                pictureElement.append(pictureSource);

                            }
                            //for last element we should have a img-tag as fallback 
                            let fallBackImg = document.createElement("img");
                            fallBackImg.setAttribute("src", imageSourceArray[j].urlStrings[0]);
                            pictureElement.append(fallBackImg);


                            /*We place the resulting picture element in a div */
                            let collectionResultContainerDiv = document.createElement("div");
                            collectionResultContainerDiv.setAttribute("class", "displayed_result_div");
                            collectionResultContainerDiv.setAttribute("id", 'displayed_collection_result-');
                            collectionResultContainerDiv.append(pictureElement);

                            collectionDetailElement.append(collectionResultContainerDiv);
                            detailsDiv.append(collectionDetailElement);


                        }
                    }

                    copyOfResultDiv.append(detailsDiv);






                }
            }
        }
    }
}



function presentFilterOptions() {

    /** <select id = "tv_search_filter_select">
                            <!--Add options to designate what options to search on : Keyword, year etc, singular option-->
                        </select>
                        <div class = "search_input_div" id = "tv_search_input_div">
                        <input type="text" placeholder="Enter keyword to search for a series matching that keyword">
                        <!--We add multi-selectable radio buttons to filter on genres in js-->
                        </div>
                        <button class = "search_button" id = "tv_search_form_button">Search</button> */


    setUpTvSearchOptions();

    /**<legend>Search : Movies </legend>
                    <form class ="movie_search_form">
                        <select id = "movie_search_filter_select">
                            <!--Add options to designate what options to search on : Keyword, year etc-->
                        </select>
                        <input type="text" placeholder="Enter keyword to search for movies matching that keyword">
                        <!--We add multi-selectable radio buttons to filter on genres in js-->
                        <button class = "search_button" id = "movie_search_form_button">Search</button>
                    </form> */

    /*                                 URLGenerator.queryParameters.movieSearchParameters;
     */

    setUpMovieSearchOptions();



                //peoplö search

/*                 URLGenerator.queryParameters.personSearchParameters.
 *//*          let personFilterSelectElement = document.getElementById("person_number_of_results");
 */        setUpPersonSearchOptions();


}



function setUpTvSearchOptions() {
    let tvSearchForm = document.getElementById("tv-search-form");
    let tvSearchDiv = document.getElementById("tv_search_input_div");
    let tvSearchButton = document.getElementById("tv_search_form_button");
    let tvSeriesOptionArray = new Array(3);

    let tvSearchTextInput = document.getElementById("tv_search_text_input");
    let tvSearchDateInput = document.getElementById("tv_search_date_input");
    tvSearchDateInput.setAttribute("class", "not_displayed_element");
    let tvSearchYearInput = document.getElementById("tv_search_year_input");
    tvSearchYearInput.setAttribute("class", "not_displayed_element");


    //We make a list where the user can select what to search on
    let tvTitleOption = document.getElementById("tv_search_text_input");
    //native name for both language and country exists
    // tvTitleOption.setAttribute("text", );
    tvTitleOption.setAttribute("alt", "Search for tv-series on their titles");

    //We make a list where the user can select what to search on
    // let tvYearOption = document.getElementById("tv_checkbox_year_input");
    // tvYearOption.setAttribute("value", "year");
    //native name for both language and country exists
    //tvYearOption.setAttribute("text", );
    // tvYearOption.setAttribute("alt", "Search for tv-series on if they had episodes aired that year");


    //We make a list where the user can select what to search on
    // let tvFirstAirDate = document.getElementById("tv_checkbox_date_input");
    //native name for both language and country exists
    //tvFirstAirDate.setAttribute("text", );
    // tvFirstAirDate.setAttribute("alt", "Search for tv-series by their release dates");
    // tvFirstAirDate.setAttribute("label", "Release date");







    // tvFirstAirDate.addEventListener("change", () => {

    //     if (tvFirstAirDate.checked) {
    //         tvSearchDateInput.setAttribute("class", "displayed_element");


    //     }
    //     else {
    //         tvSearchDateInput.setAttribute("class", "not_displayed_element");

    //     }
    // });

    // tvYearOption.addEventListener("change", () => {
    //     if (tvYearOption.checked) {
    //         tvSearchYearInput.setAttribute("class", "displayed_element");


    //     }
    //     else {
    //         tvSearchYearInput.setAttribute("class", "not_displayed_element");


    //     }

    // });





    tvSearchForm.addEventListener("submit", onTvSearchFormSubmit());

    function onTvSearchFormSubmit() {
        return (event) => {
            event.stopPropagation();
            event.preventDefault();
            let queryParameter;
            let numberOfAddedElements = 0;

            //This array contains what parameters we should include
            let selectedValues = [tvSearchTextInput.value];


            if (selectedValues[0]) {

                let queryParameters = new Array(3);
                selectedValues.forEach((value, index) => {
                    switch (index) {
                        case 0:
                            {
                                if (value) {
                                    queryParameters[index] = "query=" + tvSearchTextInput.value.replaceAll(" ", "+");
                                }

                            }



                            break;





                        default:
                            break;
                    }

                });

                let tvNumberOfElementsInput = document.getElementById("tv_number_of_results");


                let searchEndpoint = URLGenerator.getSearchEndpoint(URLGenerator.tableEndpoints.tvShows.base, queryParameters);
                if (searchEndpoint && navigator.onLine) {

                    //If the search point can be made we need to reset page count and pageNumber
                    URLGenerator.resetElementCountAndPageNUmber();
                    UIDataObject.getSelectionOfTvShows(searchEndpoint, tvNumberOfElementsInput.value);
                }
                else if (!navigator.onLine) {
                    //Prioritized over search endpoint
                    alert("You do not seem to have internet connection, welcome back as soon as you have wifi!");

                }

            }
            else{

                alert("The text field can not be empty, please try again!");
            }
        };
    }
}


function setUpMovieSearchOptions() {
    let movieSearchForm = document.getElementById("movie-search-form");

    let movieFilterSelectElement = document.getElementById("movie_search_filter_select");
    let movieSearchTextInput = document.getElementById("movie_search_text_input");
    // let movieSearchDateInput = document.getElementById("movie_search_date_input");
    // movieSearchDateInput.setAttribute("class", "not_displayed_element");
    // let movieSearchYearInput = document.getElementById("movie_search_year_input");
    // movieSearchYearInput.setAttribute("class", "not_displayed_element");
    //let movieSearchButton = document.getElementById("movie_search_form_button");




    //We make a list where the user can select what to search on
    // let movieYearOption = document.getElementById("checkbox_year_input");
    // movieYearOption.setAttribute("name", "year");
    // //native name for both language and country exists
    // // movieYearOption.setAttribute("text", );
    // movieYearOption.setAttribute("alt", "Search for tv-series on if they had episodes aired that year");
    // movieYearOption.setAttribute("title", "Search for tv-series on if they had episodes aired that year");
    // movieYearOption.setAttribute("label", "Aired on year");



    // //We make a list where the user can select what to search on
    // let movieFirstAirDate = document.getElementById("checkbox_date_input");
    // movieFirstAirDate.setAttribute("name", "first_air_date");
    // //native name for both language and country exists
    // // movieFirstAirDate.setAttribute("text", );
    // movieFirstAirDate.setAttribute("alt", "Search for tv-series by their release dates");
    // movieFirstAirDate.setAttribute("title", "Search for tv-series by their release dates");
    // movieFirstAirDate.setAttribute("label", "Release date");

    // movieFirstAirDate.addEventListener("change", () => {

    //     if (movieFirstAirDate.checked) {
    //         movieSearchDateInput.setAttribute("class", "displayed_element");


    //     }
    //     else {
    //         movieSearchDateInput.setAttribute("class", "not_displayed_element");

    //     }
    // });

    // movieYearOption.addEventListener("change", () => {
    //     if (movieYearOption.checked) {
    //         movieSearchYearInput.setAttribute("class", "displayed_element");


    //     }
    //     else {
    //         movieSearchYearInput.setAttribute("class", "not_displayed_element");


    //     }

    // });





    movieSearchForm.addEventListener("submit", onMovieSearchFormSubmit());

    function onMovieSearchFormSubmit() {
        return (event) => {
            event.preventDefault();
            event.stopPropagation();
            let queryParameter;
            let numberOfAddedElements = 0;

            //This array contains what parameters we should include
            let selectedValues = [movieSearchTextInput.value];


            if (selectedValues[0]) {

                let queryParameters = new Array(1);
                selectedValues.forEach((value, index) => {
                    switch (index) {
                        case 0:
                            {
                                if (value) {
                                    queryParameters[index] = "query=" + movieSearchTextInput.value.replaceAll(" ", "+");
                                }

                            }



                            break;





                        default:
                            break;
                    }

                });

                let movieNumberOfElementsInput = document.getElementById("movie_number_of_results");


                let searchEndpoint = URLGenerator.getSearchEndpoint(URLGenerator.tableEndpoints.movies, queryParameters);
                if (searchEndpoint && navigator.onLine) {

                    //If the search point can be made we need to reset page count and pageNumber
                    URLGenerator.resetElementCountAndPageNUmber();
                    UIDataObject.getSelectionOfMovies(searchEndpoint, movieNumberOfElementsInput.value);
                }
                else if (!navigator.onLine) {
                    //Prioritized over search endpoint
                    alert("You do not seem to have internet connection, welcome back as soon as you have wifi!");

                }
            }
            else {

                alert("Please make sure you have not left the search field empty!");
            }


        };
    }
}

function setUpPersonSearchOptions() {
    let personSearchForm = document.getElementById("person-search-form");

    let personSearchInput = document.getElementById("person_search_input");
    let personNumberOfResultsPerPage = document.getElementById("person_number_of_results");
    let personSearchButton = document.getElementById("person_search_form_button");



    //on click of either air date or year we want to show a calendar to pick dates from
    personSearchForm.addEventListener("submit", onPersonSearchFormSubmit());

    function onPersonSearchFormSubmit() {
        return (event) => {
            event.preventDefault();
            event.stopPropagation();


            if (personSearchInput.value) {

                let nameQueryParameter = "query=" + personSearchInput.value.replaceAll(" ", "+");
                let numberOfResults = personNumberOfResultsPerPage.value;
                let searchEndpoint = URLGenerator.getSearchEndpoint(URLGenerator.tableEndpoints.person, [nameQueryParameter]);
                if (searchEndpoint && navigator.onLine) {

                    //If the search point can be made we need to reset page count and pageNumber
                    URLGenerator.resetElementCountAndPageNUmber();
                    UIDataObject.getSelectionOfPeople(searchEndpoint, numberOfResults.value);
                }
                else if (!navigator.onLine) {
                    //Prioritized over search endpoint non existence
                    alert("You do not seem to have internet connection, welcome back as soon as you have wifi!");

                }
            }
            else {

                alert("Please make sure you have not left the search field empty!");
            }


        };
    }
}



