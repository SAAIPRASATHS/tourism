const fs = require('fs');
const path = require('path');
const statesFile = path.join(__dirname, '..', 'data', 'states.json');

const coordinates = {
    'andaman-nicobar-island': { capital: 'Port Blair', lat: 11.6234, lng: 92.7265 },
    'andhra-pradesh': { capital: 'Amaravati', lat: 16.5062, lng: 80.6480 },
    'arunachal-pradesh': { capital: 'Itanagar', lat: 27.0844, lng: 93.6053 },
    'assam': { capital: 'Dispur', lat: 26.1433, lng: 91.7898 },
    'bihar': { capital: 'Patna', lat: 25.6093, lng: 85.1376 },
    'chandigarh': { capital: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
    'chhattisgarh': { capital: 'Raipur', lat: 21.2514, lng: 81.6296 },
    'dadra-nagar-haveli-daman-diu': { capital: 'Daman', lat: 20.3974, lng: 72.8328 },
    'delhi': { capital: 'New Delhi', lat: 28.6139, lng: 77.2090 },
    'goa': { capital: 'Panaji', lat: 15.4909, lng: 73.8278 },
    'gujarat': { capital: 'Gandhinagar', lat: 23.2156, lng: 72.6369 },
    'haryana': { capital: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
    'himachal-pradesh': { capital: 'Shimla', lat: 31.1048, lng: 77.1734 },
    'jammu-kashmir': { capital: 'Srinagar', lat: 34.0837, lng: 74.7973 },
    'jharkhand': { capital: 'Ranchi', lat: 23.3441, lng: 85.3096 },
    'karnataka': { capital: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
    'kerala': { capital: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
    'ladakh': { capital: 'Leh', lat: 34.1526, lng: 77.5771 },
    'lakshadweep': { capital: 'Kavaratti', lat: 10.5593, lng: 72.6358 },
    'madhya-pradesh': { capital: 'Bhopal', lat: 23.2599, lng: 77.4126 },
    'maharashtra': { capital: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    'manipur': { capital: 'Imphal', lat: 24.8170, lng: 93.9368 },
    'meghalaya': { capital: 'Shillong', lat: 25.5788, lng: 91.8933 },
    'mizoram': { capital: 'Aizawl', lat: 23.7271, lng: 92.7176 },
    'nagaland': { capital: 'Kohima', lat: 25.6751, lng: 94.1086 },
    'odisha': { capital: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
    'puducherry': { capital: 'Puducherry', lat: 11.9416, lng: 79.8083 },
    'punjab': { capital: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
    'rajasthan': { capital: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    'sikkim': { capital: 'Gangtok', lat: 27.3389, lng: 88.6065 },
    'tamil-nadu': { capital: 'Chennai', lat: 13.0827, lng: 80.2707 },
    'telangana': { capital: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    'tripura': { capital: 'Agartala', lat: 23.8315, lng: 91.2868 },
    'uttar-pradesh': { capital: 'Lucknow', lat: 26.8467, lng: 80.9462 },
    'uttarakhand': { capital: 'Dehradun', lat: 30.3165, lng: 78.0322 },
    'west-bengal': { capital: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    'jammu-and-kashmir': { capital: 'Srinagar', lat: 34.0837, lng: 74.7973 },
    'andaman-nicobar': { capital: 'Port Blair', lat: 11.6234, lng: 92.7265 },
    'dadra-nagar-haveli': { capital: 'Silvassa', lat: 20.2766, lng: 73.0169 },
    'daman-diu': { capital: 'Daman', lat: 20.3974, lng: 72.8328 },
    'dadara-nagar-havelli': { capital: 'Silvassa', lat: 20.2766, lng: 73.0169 },
};

const data = JSON.parse(fs.readFileSync(statesFile, 'utf8'));
let matched = 0;
let unmatched = [];

data.forEach(state => {
    const coord = coordinates[state.id];
    if (coord) {
        state.capital = coord.capital;
        state.lat = coord.lat;
        state.lng = coord.lng;
        matched++;
    } else {
        unmatched.push(state.id);
    }
});

fs.writeFileSync(statesFile, JSON.stringify(data, null, 4), 'utf8');
console.log('Updated ' + matched + ' states with coordinates');
if (unmatched.length > 0) {
    console.log('Unmatched state IDs: ' + unmatched.join(', '));
}
