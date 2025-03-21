from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import email_routes, search_routes

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(email_routes.router, prefix="/emails", tags=["emails"])
app.include_router(search_routes.router, prefix="/search", tags=["search"])

@app.get("/")
async def root():
    return {"message": "Email Interface API is running"}
