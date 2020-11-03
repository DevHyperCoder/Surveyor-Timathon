<style>
  * {
    margin: 0;
    padding: 0;
    margin-top: 1rem;
  }

  div h3 {
    margin-top: 2rem;
    font-size: 1.3rem;
  }
  img {
    display: block;
  }

</style>

<template>
  <!-- Generated from markdown -->
  <div>
    <h2 id="features">Features:</h2>
    <p>
      All features of Surveyor App are listed below Detailed list of all the
      features can be seen though the
      <code>Features</code>
      tab OR by visiting
      <a href="https://surveyor-svelte.web.app/features">this link</a>
    </p>
    <h3 id="attempt-survey">Attempt Survey</h3>
    <p>
      If you have a survey code then enter it in the box and then attempt the
      survey. If you are not logged in then you would be also prompted to enter
      your name.
      <img src="images/img/Survey_Code_Show.png" alt="Survey Code" />
    </p>
    <h3 id="create-a-new-survey">Create a new Survey</h3>
    <p>
      Click the
      <code>New</code>
      button on the Navbar (once you sign in) or go to
      <a href="https://surveyor-svelte.web.app/new">this link</a>
      to create a new survey Enter the
      <code>Survey Title</code>
      and the
      <code>Survey Description</code>
      as shown below
      <img
        src="images/img/Survey_Title_and_Description.png"
        alt="Survey Title and Description" />
      Add a new question by clicking the
      <code>+</code>
      button. Fill out the question text and choose the question type from the
      dropdown menu.
      <img
        src="images/img/Survey_Question_Types.png"
        alt="Survey Question Types" />
      Uncheck the checkbox if the question is not required
      <img
        src="images/img/Survey_Question_Required.png"
        alt="Survey Question Requirement" />
      Click the
      <code>Delete</code>
      button to delete the question For MCQ questions, click the icon to add new
      options. You can edit the text of the options as well.
      <img src="images/img/mcqNode.png" alt="Survey Question MCQ" />
      Share the survey code (or the link) with other students for them to
      attempt the survey.
    </p>
    <h3 id="survey-responses">Survey Responses</h3>
    <p>
      Go to your dashboard (only for logged in users. ) ie, the homepage link.
      Click on the survey that you wish to see the responses of. if the survey
      is not shown, then click on
      <code>Show all surveys</code>. Once clicked, you can click the
      <code>See responses</code>
      button. Names of the attendees would appear.
      <img
        style="width:100%"
        src="images/img/response.png"
        alt="Survey responses" />
      Click a survey repondent and then view their responses!
    </p>
    <h3 id="templates">Templates</h3>
    <p>
      When you are logged in, when viewing a survey, click the
      <code>document</code>
      icon to add it to your surveys. Visit the templates by clicking on
      <code>Your Templates</code>
      on the Navbar. Click
      <code>Use template</code>
      on the survey you want to use. Once the contents are copied over, click on
      go to survey. You can edit the contents of this new survey and share with
      other students as well.
    </p>
  </div>
</template>
