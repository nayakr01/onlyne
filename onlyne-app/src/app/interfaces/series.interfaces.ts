export interface SeriesResponse {
    dates:         Dates;
    page:          number;
    results:       Serie[];
    total_pages:   number;
    total_results: number;
}

export interface Dates {
    maximum: string;
    minimum: string;
}

export interface Serie {
    backdrop_path:     null | string;
    first_air_date:    string;
    genre_ids:         number[];
    id:                number;
    name:              string;
    origin_country:    string[];
    original_language: string;
    original_name:     string;
    overview:          string;
    popularity:        number;
    poster_path:       string;
    vote_average:      number;
    vote_count:        number;
}
