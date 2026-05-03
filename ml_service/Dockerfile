FROM python:3.10

WORKDIR /app

# Copy all files (VERY IMPORTANT)
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 10000

CMD ["python", "app.py"]