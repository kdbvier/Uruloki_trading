# Use an official Python runtime as a parent image
FROM python:3.11.3-alpine3.16

# Set the working directory to /app
WORKDIR /app
# Copy the current directory contents into the container at /app
COPY . /app
# Install any needed packages specified in requirements.txt
RUN pip3 install -r requirements.txt
# Run myscript.py when the container launches

ADD mycert.crt certificates.crt
CMD ["python", "top_gainer.py"]
