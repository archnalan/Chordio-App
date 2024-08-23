# Chordio App

Chordio is a guitarist's dream tool that provides a userfriendly interface for creating and reading music chords. Chordio removes all the friction so you can add the right chords and start playing along your favorite songs. Chordio is not a music app, rather a song book that records all your song lyrics with their chords ready for you to play along.

## Technologies used
1. Front-End:
  * React
  * TypeScript
  * JavaScript
  * Vite
  * Bootstrap

2. Data Validation:
  * Zod
  * react-hook-form

3.Back-End:
  * C#
  * .Net 8
  * Entity Framework Core

4.Communication:
  * CORS
  * HttpClient

## Using the App  
1. Whereas the final user will search a song and start play along the music, we need to collect the data first. The Application has different sections for pages, song collections, categories, chords and chord charts. Creation Pages have integration of zod in react-hook-forms for validation and enhancing user experience. Here is how the form looks like!

<img src="/UI_screenshots/error handling.JPG" alt="createPage" width="500"/>

2. A collection of created items is displayed on a paginated list. Chords are shown here in alist of cards that dislay each music chart that gets created.

<img src="/UI_screenshots/chord charts.JPG" alt="createPage" width="500"/>

3. Unlike Chord charts that appear as cards, items such as pages, songs, categories appear in tabular form as below. Beside the list are action buttons that allow you to view details, edit and or delete the item from the list.

<img src="/UI_screenshots/category list.JPG" alt="createPage" width="500"/>

4.Once an element is created, We have a details page that displays all the information associated to the created element. Here as an example is all information stored reguarding the F chord.

<img src="/UI_screenshots/details page.JPG" alt="createPage" width="500"/>

5. As the list of items grows, it can be a challenge to find a specific item. This is why we need a search functionality to find items quicker as shown below.
<img src="/UI_screenshots/search functionality.JPG" alt="createPage" width="500"/>

6.To avoid accidental deletions, A confirmation step is necessary before removing any item.

<img src="/UI_screenshots/popup message.JPG" alt="createPage" width="500"/>

7. Now you can hire me. Your Application ideas will come to life!
