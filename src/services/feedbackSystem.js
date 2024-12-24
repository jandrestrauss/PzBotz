const feedbackSystem = {
    channels: ['in-app', 'email', 'discord'],
    categories: ['bug', 'feature', 'performance'],
    priority: ['low', 'medium', 'high'],

    async collectFeedback(channel, category, priority, message) {
        // Implement feedback collection logic
        console.log(`Feedback received from ${channel}: [${category}] [${priority}] ${message}`);
    }
};

export default feedbackSystem;
