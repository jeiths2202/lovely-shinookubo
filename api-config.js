// API Configuration and Service Module
// This module provides structure for real API integration

class APIService {
    constructor() {
        // API Keys (should be stored in environment variables in production)
        this.config = {
            googlePlaces: {
                apiKey: process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyB1ks3Sss829bj6l9b36LajXtm_umL-UPM',
                baseUrl: 'https://maps.googleapis.com/maps/api/place'
            },
            twitter: {
                bearerToken: process.env.TWITTER_BEARER_TOKEN || 'AAAAAAAAAAAAAAAAAAAAAFFW3gEAAAAAwLO5ZkJXKUyzU9CUgMgvu6dU%2FMU%3DTwlTf0ekq4pIgpX2aAktP5Bcdo1FMtC6FXa9BO98yegEZcKRBP',
                baseUrl: 'https://api.twitter.com/2'
            },
            facebook: {
                accessToken: process.env.FACEBOOK_ACCESS_TOKEN || '2464096337293453|_yieymOiK5H0Ysguh_oqduK2jx0',
                baseUrl: 'https://graph.facebook.com/v12.0'
            },
            openWeather: {
                apiKey: process.env.OPENWEATHER_API_KEY || 'f3ecd01ec2651182b68e69aae2072748',
                baseUrl: 'https://api.openweathermap.org/data/2.5'
            },
            customBackend: {
                baseUrl: process.env.BACKEND_URL || 'https://api.lovely-shinookubo.com',
                apiKey: process.env.BACKEND_API_KEY || 'YOUR_API_KEY_HERE'
            }
        };
        
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }
    
    // Google Places API Integration
    async searchPlaces(query, location = '35.7040,139.7052', radius = 500) {
        const cacheKey = `places_${query}_${location}_${radius}`;
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }
        
        try {
            const url = `${this.config.googlePlaces.baseUrl}/nearbysearch/json?` +
                `location=${location}&radius=${radius}&` +
                `keyword=${encodeURIComponent(query)}&` +
                `type=restaurant&language=ko&` +
                `key=${this.config.googlePlaces.apiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.status === 'OK') {
                const processedData = this.processPlacesData(data.results);
                this.cache.set(cacheKey, {
                    data: processedData,
                    timestamp: Date.now()
                });
                return processedData;
            }
            
            throw new Error(`Places API error: ${data.status}`);
        } catch (error) {
            console.error('Google Places API error:', error);
            return this.getFallbackData();
        }
    }
    
    // Get place details with photos and reviews
    async getPlaceDetails(placeId) {
        try {
            const url = `${this.config.googlePlaces.baseUrl}/details/json?` +
                `place_id=${placeId}&` +
                `fields=name,rating,reviews,photos,opening_hours,price_level&` +
                `language=ko&` +
                `key=${this.config.googlePlaces.apiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.status === 'OK') {
                return data.result;
            }
            
            throw new Error(`Place details error: ${data.status}`);
        } catch (error) {
            console.error('Place details error:', error);
            return null;
        }
    }
    
    // Twitter API Integration
    async getTweets(query, maxResults = 10) {
        const cacheKey = `tweets_${query}_${maxResults}`;
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }
        
        try {
            const url = `${this.config.twitter.baseUrl}/tweets/search/recent?` +
                `query=${encodeURIComponent(query + ' 신오쿠보')}&` +
                `max_results=${maxResults}&` +
                `tweet.fields=created_at,public_metrics,lang&` +
                `expansions=author_id`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.config.twitter.bearerToken}`
                }
            });
            
            const data = await response.json();
            
            if (data.data) {
                const processedData = this.processTweetsData(data.data);
                this.cache.set(cacheKey, {
                    data: processedData,
                    timestamp: Date.now()
                });
                return processedData;
            }
            
            return [];
        } catch (error) {
            console.error('Twitter API error:', error);
            return this.getMockTweets();
        }
    }
    
    // Facebook Graph API Integration
    async getFacebookPosts(placeId) {
        try {
            const url = `${this.config.facebook.baseUrl}/${placeId}?` +
                `fields=name,checkins,rating_count,overall_star_rating,posts&` +
                `access_token=${this.config.facebook.accessToken}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.id) {
                return this.processFacebookData(data);
            }
            
            return null;
        } catch (error) {
            console.error('Facebook API error:', error);
            return null;
        }
    }
    
    // Weather API for context-aware recommendations
    async getWeather(lat = 35.7040, lon = 139.7052) {
        const cacheKey = `weather_${lat}_${lon}`;
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < 30 * 60 * 1000) { // 30 minutes cache
                return cached.data;
            }
        }
        
        try {
            const url = `${this.config.openWeather.baseUrl}/weather?` +
                `lat=${lat}&lon=${lon}&` +
                `appid=${this.config.openWeather.apiKey}&` +
                `units=metric&lang=ko`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.cod === 200) {
                const weatherData = {
                    temp: data.main.temp,
                    condition: data.weather[0].main,
                    description: data.weather[0].description
                };
                
                this.cache.set(cacheKey, {
                    data: weatherData,
                    timestamp: Date.now()
                });
                
                return weatherData;
            }
            
            return null;
        } catch (error) {
            console.error('Weather API error:', error);
            return { temp: 20, condition: 'Clear', description: '맑음' };
        }
    }
    
    // Custom Backend API for reviews and user data
    async submitReview(review) {
        try {
            const response = await fetch(`${this.config.customBackend.baseUrl}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.config.customBackend.apiKey
                },
                body: JSON.stringify(review)
            });
            
            if (response.ok) {
                return await response.json();
            }
            
            throw new Error('Failed to submit review');
        } catch (error) {
            console.error('Review submission error:', error);
            // Store locally for offline sync
            this.storeOfflineReview(review);
            return { success: false, offline: true };
        }
    }
    
    async getReviews(restaurantId, limit = 10) {
        try {
            const response = await fetch(
                `${this.config.customBackend.baseUrl}/reviews/${restaurantId}?limit=${limit}`,
                {
                    headers: {
                        'X-API-Key': this.config.customBackend.apiKey
                    }
                }
            );
            
            if (response.ok) {
                return await response.json();
            }
            
            return [];
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
            return this.getOfflineReviews(restaurantId);
        }
    }
    
    // AI Recommendation Engine
    async getAIRecommendations(userPreferences, context) {
        try {
            const response = await fetch(`${this.config.customBackend.baseUrl}/ai/recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.config.customBackend.apiKey
                },
                body: JSON.stringify({
                    preferences: userPreferences,
                    context: {
                        ...context,
                        time: new Date().toISOString(),
                        weather: await this.getWeather()
                    }
                })
            });
            
            if (response.ok) {
                return await response.json();
            }
            
            return this.getLocalAIRecommendations(userPreferences, context);
        } catch (error) {
            console.error('AI recommendations error:', error);
            return this.getLocalAIRecommendations(userPreferences, context);
        }
    }
    
    // Local AI-like recommendation logic (fallback)
    getLocalAIRecommendations(preferences, context) {
        const recommendations = [];
        const hour = new Date().getHours();
        
        // Time-based recommendations
        if (hour >= 6 && hour < 11) {
            recommendations.push({
                type: 'time',
                title: '아침 추천',
                restaurants: ['신촌카페'],
                reason: '모닝 세트 메뉴가 인기입니다',
                confidence: 85
            });
        } else if (hour >= 11 && hour < 14) {
            recommendations.push({
                type: 'time',
                title: '점심 추천',
                restaurants: ['백종원의 본가', '신전떡볶이'],
                reason: '런치 특선 메뉴 제공 중',
                confidence: 90
            });
        } else if (hour >= 17 && hour < 22) {
            recommendations.push({
                type: 'time',
                title: '저녁 추천',
                restaurants: ['화촌 삼겹살', '막걸리 모노가타리'],
                reason: '회식 및 모임 장소로 인기',
                confidence: 92
            });
        }
        
        // Preference-based recommendations
        if (preferences.favoriteCategory) {
            recommendations.push({
                type: 'preference',
                title: '취향 맞춤',
                restaurants: this.getRestaurantsByCategory(preferences.favoriteCategory),
                reason: `선호하시는 ${preferences.favoriteCategory} 카테고리`,
                confidence: 88
            });
        }
        
        // Weather-based recommendations
        if (context.weather && (context.weather.condition === 'Rain' || context.weather.condition === 'Snow')) {
            recommendations.push({
                type: 'weather',
                title: '날씨 추천',
                restaurants: ['신전떡볶이', '막걸리 모노가타리'],
                reason: '따뜻한 음식으로 추천',
                confidence: 80
            });
        }
        
        return recommendations;
    }
    
    // Helper methods
    processPlacesData(places) {
        return places.map(place => ({
            id: place.place_id,
            name: place.name,
            rating: place.rating || 0,
            reviews: place.user_ratings_total || 0,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            priceLevel: place.price_level || 2,
            openNow: place.opening_hours?.open_now || false,
            photos: place.photos?.map(photo => photo.photo_reference) || []
        }));
    }
    
    processTweetsData(tweets) {
        return tweets.map(tweet => ({
            id: tweet.id,
            text: tweet.text,
            createdAt: tweet.created_at,
            metrics: tweet.public_metrics,
            sentiment: this.analyzeSentiment(tweet.text)
        }));
    }
    
    processFacebookData(data) {
        return {
            name: data.name,
            checkins: data.checkins || 0,
            rating: data.overall_star_rating || 0,
            ratingCount: data.rating_count || 0,
            posts: data.posts?.data || []
        };
    }
    
    analyzeSentiment(text) {
        // Simple sentiment analysis
        const positiveWords = ['맛있', '좋', '최고', '추천', '훌륭', '굿', '대박'];
        const negativeWords = ['별로', '실망', '나쁘', '최악', '비추', '글쎄'];
        
        let score = 0;
        positiveWords.forEach(word => {
            if (text.includes(word)) score++;
        });
        negativeWords.forEach(word => {
            if (text.includes(word)) score--;
        });
        
        if (score > 0) return 'positive';
        if (score < 0) return 'negative';
        return 'neutral';
    }
    
    getRestaurantsByCategory(category) {
        const categoryMap = {
            'korean': ['백종원의 본가', '막걸리 모노가타리', '한강 치킨'],
            'bbq': ['화촌 삼겹살', '고깃집 마을'],
            'cafe': ['신촌카페'],
            'street': ['신전떡볶이', '서울김밥']
        };
        
        return categoryMap[category] || [];
    }
    
    storeOfflineReview(review) {
        const offlineReviews = JSON.parse(localStorage.getItem('offlineReviews') || '[]');
        offlineReviews.push(review);
        localStorage.setItem('offlineReviews', JSON.stringify(offlineReviews));
    }
    
    getOfflineReviews(restaurantId) {
        const allReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
        return allReviews.filter(review => review.restaurantId === restaurantId);
    }
    
    getFallbackData() {
        // Return mock data when API fails
        return [
            {
                id: 'mock1',
                name: '화촌 삼겹살',
                rating: 4.8,
                reviews: 1245,
                lat: 35.7040,
                lng: 139.7052,
                priceLevel: 3,
                openNow: true
            }
        ];
    }
    
    getMockTweets() {
        return [
            {
                id: 'tweet1',
                text: '신오쿠보 화촌 삼겹살 정말 맛있어요!',
                createdAt: new Date().toISOString(),
                metrics: { like_count: 45, retweet_count: 5 },
                sentiment: 'positive'
            }
        ];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIService;
}
