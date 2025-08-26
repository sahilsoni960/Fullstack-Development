# 🚀 Market Digest AI - Render Deployment Guide

## 📋 Prerequisites

1. **GitHub Repository** with your project
2. **Render Account** (free tier available)
3. **API Keys:**
   - [NewsAPI.org](https://newsapi.org/) - Get free API key
   - [Google Gemini AI](https://makersuite.google.com/app/apikey) - Get API key

---

## 🔧 Step 1: Prepare Your Repository

### 1.1 Update Backend Configuration

The backend is already configured to use environment variables:
- `NEWS_API_KEY` - Your NewsAPI.org key
- `GEMINI_API_KEY` - Your Google Gemini API key

### 1.2 Files Already Created:
- ✅ `market-digest-backend/Dockerfile`
- ✅ `market-digest-backend/.dockerignore`
- ✅ `market-digest-backend/render.yaml`
- ✅ `market-digest-frontend/Dockerfile`
- ✅ `market-digest-frontend/nginx.conf`
- ✅ `market-digest-frontend/.dockerignore`

---

## 🌐 Step 2: Deploy Backend on Render

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Verify your email

### 2.2 Deploy Backend Service
1. **Click "New +"** → **"Web Service"**
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Name:** `market-digest-backend`
   - **Environment:** `Docker`
   - **Region:** `Oregon` (or closest to you)
   - **Branch:** `main`
   - **Root Directory:** `market-digest-backend`
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/market-digest-backend-0.0.1-SNAPSHOT.jar`

### 2.3 Add Environment Variables
In the Render dashboard, go to **Environment** tab and add:
```
NEWS_API_KEY = your_newsapi_key_here
GEMINI_API_KEY = your_gemini_api_key_here
PORT = 8080
```

### 2.4 Deploy
- Click **"Create Web Service"**
- Wait for build to complete (5-10 minutes)
- Note the **URL** (e.g., `https://market-digest-backend.onrender.com`)

---

## 🎨 Step 3: Deploy Frontend on Render

### 3.1 Create Frontend Service
1. **Click "New +"** → **"Web Service"**
2. **Select the same GitHub repository**
3. **Configure the service:**
   - **Name:** `market-digest-frontend`
   - **Environment:** `Docker`
   - **Region:** `Oregon` (same as backend)
   - **Branch:** `main`
   - **Root Directory:** `market-digest-frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start` (or use the Dockerfile)

### 3.2 Update Frontend Configuration
The frontend is already configured to use relative API paths in production.

### 3.3 Deploy
- Click **"Create Web Service"**
- Wait for build to complete (3-5 minutes)
- Note the **URL** (e.g., `https://market-digest-frontend.onrender.com`)

---

## 🔗 Step 4: Connect Frontend to Backend

### 4.1 Update Frontend API Configuration
If needed, update the frontend to point to your backend URL:

```typescript
// In market-digest-frontend/src/services/api.ts
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.onrender.com/api'  // Your backend URL
  : 'http://localhost:8080/api';
```

### 4.2 Redeploy Frontend
After updating the API configuration, redeploy the frontend service.

---

## 🧪 Step 5: Test Your Deployment

### 5.1 Test Backend
Visit your backend URL + `/api/health`:
```
https://your-backend-url.onrender.com/api/health
```
Should return: `{"status":"UP"}`

### 5.2 Test Frontend
Visit your frontend URL:
```
https://your-frontend-url.onrender.com
```
Should show the Market Digest AI interface.

### 5.3 Test API Endpoints
Test the main endpoints:
- `GET /api/companies` - List companies
- `POST /api/news` - Fetch news
- `POST /api/summarize` - AI summarization

---

## 🔧 Step 6: Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json/pom.xml

2. **API Connection Issues:**
   - Verify environment variables are set
   - Check CORS configuration
   - Ensure API keys are valid

3. **Frontend Not Loading:**
   - Check if backend is running
   - Verify API URLs are correct
   - Check browser console for errors

### Debug Commands:
```bash
# Check backend logs
curl https://your-backend-url.onrender.com/api/health

# Check frontend
curl https://your-frontend-url.onrender.com
```

---

## 💰 Free Tier Limitations

**Render Free Tier:**
- **Backend:** 750 hours/month (about 31 days)
- **Frontend:** 750 hours/month
- **Sleep after 15 minutes** of inactivity
- **Cold start** takes 30-60 seconds

**To stay within limits:**
- Services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Perfect for demo/testing purposes

---

## 🚀 Step 7: Custom Domain (Optional)

### 7.1 Add Custom Domain
1. In Render dashboard, go to your service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain
4. Update DNS records as instructed

### 7.2 SSL Certificate
Render automatically provides SSL certificates for custom domains.

---

## 📊 Step 8: Monitoring

### 8.1 Render Dashboard
- Monitor service health
- View logs
- Check resource usage

### 8.2 Health Checks
Your backend includes a health check endpoint:
```
GET /api/health
```

---

## 🎉 Success!

Your Market Digest AI is now deployed and accessible worldwide!

**Frontend URL:** `https://your-frontend-url.onrender.com`
**Backend URL:** `https://your-backend-url.onrender.com`

---

## 🔄 Updates and Maintenance

### Updating Your App:
1. Push changes to GitHub
2. Render automatically redeploys
3. Monitor deployment logs

### Environment Variables:
- Update in Render dashboard
- Redeploy service after changes

### Scaling (Paid Plans):
- Upgrade to paid plan for more resources
- Enable auto-scaling
- Add more regions

---

## 📞 Support

- **Render Documentation:** [docs.render.com](https://docs.render.com)
- **Render Community:** [community.render.com](https://community.render.com)
- **GitHub Issues:** Create issues in your repository

---

**Happy Deploying! 🚀**
