export class StorageManager {
    static getProfiles() {
        return JSON.parse(localStorage.getItem('profiles')) || [];
    }

    static saveProfiles(profiles) {
        localStorage.setItem('profiles', JSON.stringify(profiles));
    }

    static getFavorites(profileId) {
        const key = `favorites_${profileId}`;
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    static saveFavorites(profileId, favorites) {
        const key = `favorites_${profileId}`;
        localStorage.setItem(key, JSON.stringify(favorites));
    }

    static addFavorite(profileId, book) {
        const favorites = this.getFavorites(profileId);
        if (!favorites.some(f => f.id === book.id)) {
            favorites.push(book);
            this.saveFavorites(profileId, favorites);
        }
    }

    static removeFavorite(profileId, bookId) {
        const favorites = this.getFavorites(profileId);
        const updatedFavorites = favorites.filter(f => f.id !== bookId);
        this.saveFavorites(profileId, updatedFavorites);
    }
}


static getReadingStats(profileId) {
    const key = `reading_stats_${profileId}`;
    return JSON.parse(localStorage.getItem(key)) || {
        booksRead: 0,
        readingGoal: 10
    };
}

static updateReadingStats(profileId, stats) {
    const key = `reading_stats_${profileId}`;
    localStorage.setItem(key, JSON.stringify(stats));
}

static incrementBooksRead(profileId) {
    const stats = this.getReadingStats(profileId);
    stats.booksRead++;
    this.updateReadingStats(profileId, stats);
    return stats;
}

static updateReadingGoal(profileId, newGoal) {
    const stats = this.getReadingStats(profileId);
    stats.readingGoal = newGoal;
    this.updateReadingStats(profileId, stats);
    return stats;
}
