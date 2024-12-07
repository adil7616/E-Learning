// Function to redirect to the Courses page
document.getElementById('getStartedBtn').addEventListener('click', () => {
    window.location.href = 'courses.html'; // Redirect to the courses page
});

// Sample testimonials data
const testimonials = [
    {
        message: "This platform helped me learn at my own pace. Highly recommended!",
        studentName: "John Doe"
    },
    {
        message: "I loved the interactive courses and the support I received. Great experience!",
        studentName: "Jane Smith"
    },
    {
        message: "An amazing platform for learning new skills and improving existing ones.",
        studentName: "Robert Brown"
    }
];

// Function to render testimonials
const renderTestimonials = () => {
    const testimonialCards = document.getElementById('testimonial-cards');

    testimonials.forEach(testimonial => {
        const card = document.createElement('div');
        card.classList.add('testimonial-card');
        
        card.innerHTML = `
            <p>"${testimonial.message}"</p>
            <p class="student-name">- ${testimonial.studentName}</p>
        `;

        testimonialCards.appendChild(card);
    });
};

// Initial rendering of testimonials
renderTestimonials();
