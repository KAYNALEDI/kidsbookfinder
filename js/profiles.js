import { StorageManager } from './storage.js';

class ProfilesPage {
    constructor() {
        this.profileForm = document.getElementById('profileForm');
        this.profilesList = document.getElementById('profilesList');
        this.initializeEventListeners();
        this.displayProfiles();
    }

    initializeEventListeners() {
        this.profileForm.addEventListener('submit', (e) => this.handleProfileSubmit(e));
    }

    handleProfileSubmit(e) {
        e.preventDefault();
        const profile = {
            id: Date.now().toString(),
            name: document.getElementById('childName').value,
            age: parseInt(document.getElementById('childAge').value),
            readingLevel: document.getElementById('readingLevel').value,
            createdAt: new Date().toISOString()
        };

        const profiles = StorageManager.getProfiles();
        profiles.push(profile);
        StorageManager.saveProfiles(profiles);

        this.profileForm.reset();
        this.displayProfiles();
    }

    displayProfiles() {
        const profiles = StorageManager.getProfiles();
        this.profilesList.innerHTML = profiles.map(profile => `
            <div class="profile-card">
                <h3>${profile.name}</h3>
                <p>Age: ${profile.age}</p>
                <p>Reading Level: ${profile.readingLevel}</p>
                <button onclick="deleteProfile('${profile.id}')" class="delete-btn">Delete</button>
            </div>
        `).join('');
    }

    deleteProfile(profileId) {
        const profiles = StorageManager.getProfiles();
        const updatedProfiles = profiles.filter(p => p.id !== profileId);
        StorageManager.saveProfiles(updatedProfiles);
        this.displayProfiles();
    }
}

window.deleteProfile = (profileId) => {
    const page = new ProfilesPage();
    page.deleteProfile(profileId);
};

document.addEventListener('DOMContentLoaded', () => {
    new ProfilesPage();
});
