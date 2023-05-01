export interface MovieDetails {
    adult:                 boolean;
    backdrop_path:         string;
    belongs_to_collection: null;
    budget:                number;
    genres:                Genre[];
    homepage:              string;
    id:                    number;
    imdb_id:               string;
    original_language:     string;
    original_title:        string;
    overview:              string;
    popularity:            number;
    poster_path:           string;
    production_companies:  ProductionCompany[];
    production_countries:  ProductionCountry[];
    release_date:          string;
    revenue:               number;
    runtime:               number;
    spoken_languages:      SpokenLanguage[];
    status:                string;
    tagline:               string;
    title:                 string;
    video:                 boolean;
    vote_average:          number;
    vote_count:            number;
}

export interface Genre {
    id:   number;
    name: string;
}

export interface ProductionCompany {
    id:             number;
    logo_path:      null;
    name:           string;
    origin_country: string;
}

export interface ProductionCountry {
    iso_3166_1: string;
    name:       string;
}

export interface SpokenLanguage {
    english_name: string;
    iso_639_1:    string;
    name:         string;
}

export interface SerieDetails {
    adult:                boolean;
    backdrop_path:        null;
    created_by:           any[];
    episode_run_time:     number[];
    first_air_date:       string;
    genres:               Genre[];
    homepage:             string;
    id:                   number;
    in_production:        boolean;
    languages:            string[];
    last_air_date:        string;
    last_episode_to_air:  LastEpisodeToAir;
    name:                 string;
    next_episode_to_air:  null;
    networks:             Network[];
    number_of_episodes:   number;
    number_of_seasons:    number;
    origin_country:       string[];
    original_language:    string;
    original_name:        string;
    overview:             string;
    popularity:           number;
    poster_path:          string;
    production_companies: any[];
    production_countries: any[];
    seasons:              Season[];
    spoken_languages:     SpokenLanguage[];
    status:               string;
    tagline:              string;
    type:                 string;
    vote_average:         number;
    vote_count:           number;
}

export interface Genre {
    id:   number;
    name: string;
}

export interface LastEpisodeToAir {
    id:              number;
    name:            string;
    overview:        string;
    vote_average:    number;
    vote_count:      number;
    air_date:        string;
    episode_number:  number;
    production_code: string;
    runtime:         null;
    season_number:   number;
    show_id:         number;
    still_path:      null;
}

export interface Network {
    id:             number;
    logo_path:      string;
    name:           string;
    origin_country: string;
}

export interface Season {
    air_date:      string;
    episode_count: number;
    id:            number;
    name:          string;
    overview:      string;
    poster_path:   null;
    season_number: number;
}

export interface SpokenLanguage {
    english_name: string;
    iso_639_1:    string;
    name:         string;
}