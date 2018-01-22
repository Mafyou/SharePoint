Hi,
I wanted to share about my recent project using the technologies in this title:
SharePoint: we are much to like about
React: A Javascript Framework by Facebook
PnP: Pattern and Practices, to use SharePoint easily
Typescript: The futur of Typed Javascript
Basically, my goal was to show a list dynamically from a content type of SharePoint's list and show how to add items in it.
First thing first, you can find the sources here.
Then, I will introduce you to this code and show more thing to be comprehensive by more and more people.
To begin, we look hover index.html. It's a simple html file which reference all the stuff the belong to it. Javascript and CSS.
After that, we can look at App.tsx to know which action have to be made. We initiate PnP to take jSon, init the state of type script, bind event to methods and then, generate our components.
Those components are generate dynamically from the Content Type received by SharePoint.
To deploy, you have a file named deploy.ps1. It's very useful and you just have to point the right list name you have and the content type used.
Then, you can deploy the solution and referenced this index.html from a content editor webpart.
Enjoy!