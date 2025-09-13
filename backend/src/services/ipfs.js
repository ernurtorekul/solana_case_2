const axios = require('axios');
const FormData = require('form-data');

class IPFSService {
  constructor() {
    this.pinataApiKey = process.env.PINATA_API_KEY;
    this.pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
    this.pinataBaseUrl = 'https://api.pinata.cloud';
  }

  async uploadJSON(jsonData, name) {
    if (!this.pinataApiKey || !this.pinataSecretApiKey) {
      // Return mock IPFS hash for demo
      console.log('IPFS credentials not configured, using mock hash');
      return `https://gateway.pinata.cloud/ipfs/QmMockHash${Date.now()}`;
    }

    try {
      const response = await axios.post(
        `${this.pinataBaseUrl}/pinning/pinJSONToIPFS`,
        {
          pinataContent: jsonData,
          pinataMetadata: {
            name: name,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': this.pinataApiKey,
            'pinata_secret_api_key': this.pinataSecretApiKey,
          },
        }
      );

      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
      console.error('IPFS upload error:', error.message);
      // Return mock hash on error
      return `https://gateway.pinata.cloud/ipfs/QmMockHash${Date.now()}`;
    }
  }

  async uploadFile(fileBuffer, fileName, mimeType) {
    if (!this.pinataApiKey || !this.pinataSecretApiKey) {
      console.log('IPFS credentials not configured, using mock hash');
      return `https://gateway.pinata.cloud/ipfs/QmMockFileHash${Date.now()}`;
    }

    try {
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: fileName,
        contentType: mimeType,
      });
      
      const metadata = JSON.stringify({
        name: fileName,
      });
      formData.append('pinataMetadata', metadata);

      const response = await axios.post(
        `${this.pinataBaseUrl}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'pinata_api_key': this.pinataApiKey,
            'pinata_secret_api_key': this.pinataSecretApiKey,
          },
        }
      );

      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
      console.error('IPFS file upload error:', error.message);
      return `https://gateway.pinata.cloud/ipfs/QmMockFileHash${Date.now()}`;
    }
  }

  createCertificateMetadata(studentName, courseName, issuerName, date) {
    return {
      name: `${courseName} Certificate`,
      description: `Certificate of completion for ${courseName} issued to ${studentName} by ${issuerName}`,
      image: `https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=${encodeURIComponent(courseName + ' Certificate')}`,
      attributes: [
        {
          trait_type: "Student Name",
          value: studentName
        },
        {
          trait_type: "Course Name", 
          value: courseName
        },
        {
          trait_type: "Issuer Name",
          value: issuerName
        },
        {
          trait_type: "Issue Date",
          value: date
        },
        {
          trait_type: "Certificate Type",
          value: "Education"
        }
      ],
      properties: {
        category: "Education Certificate",
        country: "Kazakhstan"
      }
    };
  }

  createPropertyMetadata(propertyName, totalValue, totalTokens, location, imageUrl) {
    return {
      name: propertyName,
      description: `Fractional ownership tokens for ${propertyName}. Total property value: $${totalValue.toLocaleString()}`,
      image: imageUrl || `https://via.placeholder.com/600x400/059669/FFFFFF?text=${encodeURIComponent(propertyName)}`,
      attributes: [
        {
          trait_type: "Property Name",
          value: propertyName
        },
        {
          trait_type: "Total Value (USD)",
          value: totalValue
        },
        {
          trait_type: "Total Tokens",
          value: totalTokens
        },
        {
          trait_type: "Location",
          value: location || "Kazakhstan"
        },
        {
          trait_type: "Asset Type",
          value: "Real Estate"
        }
      ],
      properties: {
        category: "Real Estate Token",
        country: "Kazakhstan",
        tokenType: "Fractional Ownership"
      }
    };
  }
}

module.exports = new IPFSService();