const express = require('express')

const app = express()
const port = 3000

app.use(express.json()) // This line is necessary for Express to be able to parse JSON in request body's

const favoriteMovieList = [{
	title: "Star Wars",
	starRating: 5,
	isRecommended: true,
	createdAt: new Date(),
	lastModified: new Date()
}, {
	title: "The Avengers",
	starRating: 4,
	isRecommended: true,
	createdAt: new Date(),
	lastModified: new Date()
}];

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.get('/all-movies', (req, res) => {
    console.log("regular option");
    filteredMovieList = favoriteMovieList
	res.json({
		success: true,
		movieList: filteredMovieList
	})
})

app.get('/all-movies/:ratingToFilter', (req, res) => {
    const filteredMovieList = []
    favoriteMovieList.forEach((movie)=>{
        if (movie.starRating >= Number(req.params.ratingToFilter)){
            filteredMovieList.push(movie);
        }return
    })
	res.json({
		success: true,
		movieList: filteredMovieList
	})
})

app.get('/single-movie/:titleToFind', (req, res) => {
	const movieRequested = favoriteMovieList.find((movie)=>{
		return movie.title === req.params.titleToFind;
	})
	res.json({
		success: true,
		movie: movieRequested
	})
})

app.post('/new-movie', (req, res) => {
    if (req.body.title === undefined || typeof(req.body.title) !== "string") {
		res.json({
			success: false,
			message: "movie title is required and must be a string"
		})
		return
	}
	if (req.body.starRating === undefined || typeof(req.body.starRating) !== "number"){
		res.json({
			success: false,
			message: "movie star rating is required and must be a number"
		})
		return
	}
	if (req.body.isRecommended === undefined || typeof(req.body.isRecommended) !== "boolean"){
		res.json({
			success: false,
			message: "movie is recommended is required and must be a boolean value"
		})
		return
	}

	const newMovie = {}
	newMovie.title = req.body.title;
	newMovie.starRating = req.body.starRating;
	newMovie.isRecommended = req.body.isRecommended;
    newMovie.createdAt = new Date();
    newMovie.lastModified = new Date();

	favoriteMovieList.push(newMovie);

	res.json({
		success: true
	})
})


app.put("/update-movie/:titleToUpdate", (req, res)=>{

	const movieTitleToFind = req.params.titleToUpdate;
    // console.log(movieTitleToFind);
	
	const originalMovie = favoriteMovieList.find((movie)=>{
		return movie.title === movieTitleToFind;
	})
    // console.log(orignalMovie);

	const originalMovieIndex = favoriteMovieList.findIndex((movie)=>{
		return movie.title === movieTitleToFind;
	})

	if (!originalMovie) {
		res.json({
			success: false,
			message: "Could not find movie in movie list"
		})
		return;
	}
    const updatedMovie = {}

	if (req.body.title !== undefined && typeof(req.body.title) === "string")
        {updatedMovie.title = req.body.title
	    }else {updatedMovie.title = originalMovie.title
	}

	if (req.body.starRating !== undefined && typeof(req.body.starRating) === "number")
        {updatedMovie.starRating = req.body.starRating
	    }else {updatedMovie.starRating = originalMovie.starRating
	    }

	if (req.body.isRecommended !== undefined && typeof(req.body.isRecommended) === "boolean")
        {updatedMovie.isRecommended = req.body.isRecommended
	    }else {updatedMovie.isRecommended = updatedMovie.isRecommended
	    }

	favoriteMovieList[originalMovieIndex] = updatedMovie;

	res.json({
		success: true
	})
})

app.delete("/delete-movie/:titleToDelete", (req, res)=>{

	const movieTitleToDelete = req.params.titleToDelete

	const indexOfMovie = favoriteMovieList.findIndex((movie)=>{
		return movie.title === movieTitleToDelete
	})

	favoriteMovieList.splice(indexOfMovie, 1)

	res.json({
		success: true
	})
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})