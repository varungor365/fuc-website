"""
Test the virtual try-on service
"""
import requests
import os

def test_service():
    service_url = "http://localhost:5000"
    
    # Test health check
    try:
        response = requests.get(f"{service_url}/health")
        if response.status_code == 200:
            print("✅ Service is running")
            print(f"Response: {response.json()}")
        else:
            print("❌ Service health check failed")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to service: {e}")
        print("Make sure to start the service first with: .\\start.ps1")
        return False
    
    return True

if __name__ == "__main__":
    print("Testing Virtual Try-On Service...")
    test_service()