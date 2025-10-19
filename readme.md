## Site link

Link: https://sarah-m-ahmad.github.io/A2-project/

## Rationale

During this project, I learned how to develop a dynamic website using the NSFA API, and while I heavily relied on Generative AI (See Resource list), I expanded my knowledge of JavaScript and API handling.

**Mosaic layout**

Generating a mosaic layout faithful to the product was difficult to dynamically generate. I initially attempted using Vanilla CSS and JS, and then the masonry framework, but populating the layout with the items' aspect ratios was not feasible. Ultimately, I used a column layout instead, as it allowed the aspect ratios to remain preserved, unlike a traditional grid. In hindsight, this proved effective, considering the transition to a mobile view was less jarring.

Another aspect this affected was the heading, which was initially supposed to be within the mosaic layout. Similarly, this optimised the transition to a mobile view, providing a better user experience.

**Panning wide images**

One feature I decided to add, given the API data, was to constrain very wide images to a certain ratio using an Intersection Observer, adding a CSS class, and then pan them to show the full preview when the item enters view. This was done to avoid difficulty clicking the item itself, along with the ability to showcase the full image uniquely without compromising the layout, providing a smoother user experience. The constraint to only pan upon view reduces processing.

**Responsiveness**

There were some difficulties in ensuring the site was responsive, especially for the overlay and the search button. The approach to achieving the layout is not optimal, and something I would like to resolve in future iterations of this project. Another concern was that many microinteractions, such as hover states, would not be available on mobile, which could influence whether elements afford being clicked and generate confusion. One alternate solution is to show these interactions through a long press, though this is not necessarily a common user behaviour. Hence, I have tried to design the site so that the mobile view usability is not significantly compromised without them.

**Changes to prototype**

- **Scrapped filter feature:**

  Although the filter option would have been an effective way to further refine queries, there were few relevant options given the scope of my project. Furthermore, making the filter feature responsive on mobile would have been difficult, as it would have also needed to accommodate whether the search bar was active or not. To maintain some ability to refine a query, I included the sort feature.

- **More button instead of pages**

  In the prototype, the plan was to include pages at the bottom, and users could adjust how many items are displayed on each page. Instead, I used a 'more button' to load more results as it would remain faithful to the idea of a 'one page site' and was more feasible.

- **Overlay**

  While the final output is relatively faithful to the prototype, there are still some issues I am dissatisfied with. First, the image resolution is quite low as the filePath was restricted. Instead, I ended up using the thumbnailFilePath for both the preview and the overlay itself. Second, I scrapped the carousel, though there are some basic elements in place for further iterations. The main issue was that algorithms and recommending users similar items would be beyond the scope of this project, which would either mean using static images or randomly generating results.

Overall, I am satisfied with the final product as it provides a dynamic, responsive, and open-ended experience to explore the collection in a visual format. In future iterations, I would like to further expand the site to consider video previews and a functional carousel.

**Word count:** 599

## Resource list

Alex Brandt. (2019). Stack Overflow. Stack Overflow; Stack Overflow. https://stackoverflow.com/questions/54834898/cannot-type-in-input-text-field

House, C. (2021, May 12). CSS Grid Layout Guide | CSS-Tricks. CSS-Tricks; CSS-Tricks. https://css-tricks.com/snippets/css/complete-guide-grid/#aa-basics-browser-support

MDN. (n.d.). MDN Web Docs. Developer.mozilla.org; MDN. Retrieved October 19, 2025, from https://developer.mozilla.org/en-US

MDN. (2025, June 6). - SVG | MDN. MDN Web Docs; MDN. https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/svg

Online Tutorials. (2019, June 27). Hide Header on Scroll Down Show on Scroll Up | Html CSS & Javascript. YouTube; YouTube. https://www.youtube.com/watch?v=JEBgqbZWYIQ

W3Schools. (2019a). CSS Forms. W3schools.com; W3schools.com. https://www.w3schools.com/css/css_form.asp

W3Schools. (2019b). HTML Input Types. W3schools.com; W3schools.com. https://www.w3schools.com/html/html_form_input_types.asp

W3Schools. (2025). W3Schools online web tutorials. W3schools.com; W3Schools. https://www.w3schools.com/

### Gen AI Acknlowledgements

**ChatGPT**

Uses:

- Troubleshooting and debugging (pasting snippets of code to identify errors)

- Modify/ tweak existing codes to better align to needs

- Generate new code based on instructions (e.g. I want to prevent default behaviour of the input form and instead retrieve data dynamically from the API)

OpenAI. (2025). ChatGPT (October version) [Large language model]. https://chat.openai.com/chat

**Copilot**

Uses:

- Debugging and troubleshooting code

- Generate new code based on prompts and modifying to suit personal needs

Microsoft. (2025). Copilot (October version) [Large Language Model]. https://copilot.microsoft.com/
