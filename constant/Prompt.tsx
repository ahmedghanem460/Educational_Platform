import dedent from 'dedent';

export default {
    IDEA: dedent`:AS you are coaching teacher
    - User want to learn about the topic
    - Generate 5-7 Courses for study (Short)
    - Make sure it's related to description
    - Output will be ARRAY of JSON FORMAT only
    - Don't add any plain text in output,
    
    `,
    COURSE: dedent`: As you are coaching teacher
    - User want to learn about all topics
    - Create 2 Courses With Course Name and Description, and 3 Chapters with Chapter Name and Description
    - Make sure to add chapters with all learning material courses
    - Add CourseBanner Image URL in JSON format
    - Explain the chapter content as detailed tutorial
    - Generate 5 Quizzez, 10 Flashcards and 5 Questions answer
    
    - Output in JSON format only
    
    `
}