// Add Sample Users to Database
const { UserOperations } = require('./database-connection.js');

// Sample users data
const sampleUsers = [
    {
        username: 'admin',
        email: 'admin@safetysim.ae',
        password: 'admin123',
        fullName: 'Admin User'
    },
    {
        username: 'johndoe',
        email: 'john.doe@example.com',
        password: 'password123',
        fullName: 'John Doe'
    },
    {
        username: 'sarahsmith',
        email: 'sarah.smith@example.com',
        password: 'secure456',
        fullName: 'Sarah Smith'
    },
    {
        username: 'mohammedali',
        email: 'mohammed.ali@example.com',
        password: 'dubai789',
        fullName: 'Mohammed Ali'
    },
    {
        username: 'fatimahassan',
        email: 'fatima.hassan@example.com',
        password: 'uae321',
        fullName: 'Fatima Hassan'
    },
    {
        username: 'ahmedkhalid',
        email: 'ahmed.khalid@example.com',
        password: 'khalid654',
        fullName: 'Ahmed Khalid'
    },
    {
        username: 'mariamal',
        email: 'mariam.al@example.com',
        password: 'mariam987',
        fullName: 'Mariam Al'
    },
    {
        username: 'omarsaeed',
        email: 'omar.saeed@example.com',
        password: 'omar111',
        fullName: 'Omar Saeed'
    }
];

// Function to add sample users
async function addSampleUsers() {
    try {
        for (const user of sampleUsers) {
            try {
                const result = await UserOperations.createUser(user);
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                } else {
                }
            }
        }
    } catch (error) {
    }
}

// Execute the function if this script is run directly
if (require.main === module) {
    addSampleUsers().then(() => {
        process.exit(0);
    }).catch(error => {
        process.exit(1);
    });
}

module.exports = { addSampleUsers };
