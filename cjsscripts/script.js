 //wrap everything in a global function o that all subsequent variables
//and functions are local
// Wrap все в глобальной функции ,так что все последующие 
//переменные и функции являются локальными
function toDoList() {

  //I hate writing document.getElementById every time.
  //Я ненавижу писать document.getElementById каждый раз.
  function grab(id) { 
    return document.getElementById(id); 
  }
  
  //ditto event listeners
  //так же event listeners
  var onEvent = function() {
    return function(obj, event, fn) {
      obj.addEventListener(event, fn, false);
    }; 
  }();
  
  //grab main elements and store them into variables.
  //Захватить основные элементы и сохранить их в переменных.
  var input = grab('toDo'),
  list = grab("todoList"),
  addButton = grab('btnAdd'),
  clearAll = grab('btnClear');  

  // one listener to trigger pressedEnter if enter is pressed
  //какуюто задачу  запускает нажатыйEnter, если нажата клавиша enter
  onEvent(input,"keypress", pressedEnter);
  //main button that triggers the function adding tasks to the list
  //Основная кнопка, которая запускает функцию добавления задач в список
  onEvent(addButton, "click", addItem);
  //clear all button that clears the list
  //Очистить все кнопки, которые очищают список
  onEvent(clearAll,"click", clearItems);
  
  
  
  //function for submitting on enter
  //Функция для отправки через enter или функция ОБРАБОТЧИК
  function pressedEnter(event) {
    // if key pressed is "Enter", OR matches keycode for Enter '13'"
    //Если нажата клавиша «Ввести», ИЛИ соответствует ключевому коду для ввода «13» »
    if (event.key == "Enter" || event.keyCode == 13) {
    //Run function that adds the task
    //Функция запуска, добавляющая задачу
    addItem();
  }
}


  //function that toggles the note text area to submit or edit note
  //params are grandparent, parent, child, parent sibling
  //Функция, которая переключает область текстового примечания 
  //(submit or edit)для отправки или редактирования примечания.
  //Параметры (Params) являются grandparent, parent, child, parent sibling
  function formToggle(grp,pr,c,ps){
    
    // if the class attribute of the container is noNote
    //Если атрибут класса контейнера noNote
    if(grp.getAttribute("class") === "noNote" ){
      //set the class attribute to hasNote this will remove textarea
      //Установить атрибут class в hasNote, это удалит textarea
      grp.setAttribute("class", "hasNote");
      //Display value typed into the container div for the note
      //Отображаемое значение, введенное в контейнер div для заметки
      pr.textContent = c.value;
      //get the height of the textContainer
      //Получить высоту textContainer
      var h = pr.offsetHeight;
      //get the height of the submit button
      //Получить высоту кнопки отправки
      var n = ps.offsetHeight;
      //make noteContainer = to the combined height of its children
      //Make noteContainer = для общей высоты его детей
      grp.style.height = h + n + 20 + "px";
      //change submit button text to Edit
      //Изменить текст кнопкой отправки 'Edit'
      ps.innerText = "Edit";
    }
    //or else if the class attribute is hasNote
    //Или, если атрибут класса hasNote
    else{
      //get the height of the note's container
      //Получить высоту контейнера записки
      var nc = pr.offsetHeight;
      //now empty the container
      //Теперь опорожнить контейнер
      pr.innerText = "";
      //and append the text area form within the container
      //И добавим форму текстовой области в контейнер
      pr.appendChild(c);
      //set the class to noNote
      //Установите класс в noNote
      grp.setAttribute("class", "noNote");
      //set the height of the textarea to the textContainer before it was cleared
      //Задайте высоту текстового поля в textContainer, прежде чем он будет очищен
      c.style.height = nc + "px";
      //store the textarea's height in a var
      //Хранить высоту textarea в var
      var a = c.offsetHeight;
      //store the height of the note button
      //Сохранить высоту кнопки примечания
      var b = ps.offsetHeight;
      //make the note container equal to the height of the button and textArea + 40px
      //Сделайте контейнер с заметками равным высоте кнопки и textArea + 40px
      grp.style.height = a + b + 40 + "px";
      //change button text to submit.
      //Изменить текст кнопки для отправки.
      ps.innerText = "Submit";
    }
  } 
  
  
  // function to toggle list items
  //Функция для переключения элементов списка
  function pToggle(pr,c,s){
    //if the noteconatiner height is 0 (hidden)
    //Если высота noteconatiner равна 0 (скрыто)
    if(pr.style.height === "0px"){
      //store the height of the note textarea
      //Хранить высоту текстовой области заметки
      var h = c.offsetHeight;
      //store the height of the note button
      //Сохранить высоту кнопки примечания
      var n = s.offsetHeight;
      //set the note container's height to that of its children
      //Установите высоту контейнера примечания к ее дочерним элементам
      pr.style.height = h + n + 20 + "px";
    }
    //else close the container
    //Еще закрыть контейнер
    else{
      //if the height is greater than 0 hide the container
      //Если высота больше 0, скрыть контейнер
      pr.style.height = "0px";
    }
  } 
  
  //main function that creates the todo item
  //Upon pressing enter after typing an input, or clicking the submit button, 
  //this function creates a new list element with three sibling children: a <p> 
  //holding the task & two divs to check or delete a task. i,li,p,f,f
//Основная функция, которая создает элемент todo
//После нажатия клавиши Enter или кнопки ввода или нажатия кнопки отправки,
//эта функция создает новый элемент списка с тремя дочерними элементами sibling: a <p>
//хранение задачи и двух divs для проверки или удаления задачи. I, li, p, f, f
function addItem() {
    //if the user types at least one letter
    //Если пользователь вводит хотя бы одну букву
    if (input.value.length > 0){
      //create a <li> element with createElement
      //Создать элемент <li> с помощью createElement
      var listElement = document.createElement('li');
      //give it a class using setAttribute
      //Дать ему класс, используя setAttribute
      listElement.setAttribute("class", "fadeable");
      // create a <p> element
      //Создать элемент <p>
      var pTag = document.createElement('p');
      //place <p> inside the <li> by appending it using appendChild
      //Место <p> внутри <li>, добавив его с помощью appendChild
      listElement.appendChild(pTag);
      //make the innerText of the <p> element equal to the input value using innerText
      //Сделать innerText элемента <p> равным входному значению с помощью innerText
      pTag.innerText = input.value;
      //add a delete link within the <li>
      //Добавьте ссылку удаления внутри <li>
      listElement.appendChild(deleteTask());
      //add a crossoutlink within the <li>
      //Добавьте кросс-ссылку в <li>
      listElement.appendChild(crossOut());
      //place the complete <li> element to the task list
      // Помещаем полный <li> элемент в список задач
      list.appendChild(listElement);
      //compute current opacity of the <li>( set to 0 in the css.)
      //Вычислить текущую непрозрачность <li> (установить в 0 в css.)
      var liOpacity = window.getComputedStyle(listElement).opacity;
      //then set the opacity to 1
      //Затем установите непрозрачность на 1
      listElement.style.opacity = 1;
      // clear the input
      //Очищаем ввод
      input.value = "";
      
      //create the container div for the note form and result
      //Создать контейнерный div для формы примечания и результата
      var noteContainer = document.createElement('div');
      //give it a class of noNote since we havent written one yet.
      //Дайте ему класс noNote, поскольку мы еще не записали его.
      noteContainer.setAttribute("class", "noNote");
      //hide it initially by giving it 0 height and hiding the overflow we can
      // set these elements here because we never want them to be modified via css
      //Сначала скройте его, указав 0 height и скрыв переполнение, мы можем установить эти 
      //элементы здесь, потому что мы никогда не хотим, чтобы они изменялись с помощью css
      noteContainer.style.height = "0px";
      noteContainer.style.overflow = "hidden";
      //create a span container for the textarea where we will type our note
      //Создать контейнер span для текстовой области, где мы напечатаем нашу заметку
      var textContainer = document.createElement('span');
      //create the textarea form which we will append to the container
      //Создать текстовую форму, которую мы добавим к контейнеру
      var noteTextArea = document.createElement('textarea');
      //create a new div for the button which will submit or edit notes.
      // Создать новый div для кнопки, которая будет отправлять или редактировать заметки.
      var noteBtn = document.createElement('div');
      //give the button a class
      //Дать кнопке класс
      noteBtn.setAttribute("class", "notebtn");
      //give the button some text
      //Дать кнопке какой-нибудь текст
      noteBtn.innerHTML = "submit";
      //append the container for notes to the list element
      //Добавьте контейнер для примечаний к элементу списка
      listElement.appendChild(noteContainer);
      //append the container for the note text to the note container
      //Добавьте контейнер для текста примечания к контейнеру примечания
      noteContainer.appendChild(textContainer);
      //append the actual textarea to its container
      //Добавление фактического текстового поля в контейнер
      textContainer.appendChild(noteTextArea);
      //append the submit/edit button to the main container
      //Добавьте кнопку отправки / редактирования в основной контейнер
      noteContainer.appendChild(noteBtn);
      
      //make the note submit/edit button  trigger the formToggle function 
      //Сделать заметку кнопкой submit / edit trigger function formToggle
      onEvent(noteBtn,"click", formToggle.bind(null, noteContainer,textContainer,noteTextArea,noteBtn));
      
      //make the tasks clickable and toggle note container on click.
      //Сделать задачи интерактивными и переключать контейнер примечаний при щелчке.
      onEvent(pTag, "click", pToggle.bind(null, noteContainer,textContainer,noteBtn));  
      
    }
    
    //If user tries to submit empty input do nothing.
    //Если пользователь пытается отправить пустой ввод, ничего не делать.
    else {
      return false;
    }
  } 
  
  
  
  //function creating the button that triggers the function that crosses out completed tasks.
  //Функция, создающая кнопку, которая запускает функцию, которая ПЕРЕЧЕРКИВАЕт 
  //завершенную задачу.
  function crossOut() {
    
   //Create the div using createElement()
   //Создать div с помощью createElement()
   var strikeLink = document.createElement('div');
     // set the div's class and class name using setAttribute()
     //Задайте имя и класс класса div с помощью setAttribute ()
     strikeLink.setAttribute("class", "striketask"); 
     //Place a checkmark character using innerHTML
     // Помещаем галочку с помощью innerHTML
     strikeLink.innerHTML = "✓";
     //Add eventlistener to each link that runs a function that crosses out the task
     // Добавление eventlistener в каждую ссылку, 
     //которая выполняет функцию, которая ПЕРЕЧЕРКИВАЕт задачу
     strikeLink.addEventListener("click", strikeItem);
     //return the function
     //вернуть функцию
     return strikeLink;
   }
   
   
  //function creating "delete" button that triggers the "removeItem" function on click. Same steps as above.
  // функция, создающая кнопку «delete», которая запускает функцию «removeItem» при щелчке. Те же шаги, что и выше.
  
  function deleteTask() {  
   var deleteLink = document.createElement('div');     
   deleteLink.setAttribute("class", "deletetask");     
   deleteLink.innerHTML = "X";     
   deleteLink.addEventListener("click", removeItem);
   return deleteLink;
 }
 
 
 
 
  //function for clearing all tasks
  // функция для очистки всех задач

  
  function clearItems() {
    //make the innerHTML of the list equal to nothing.
    // сделать innerHTML списка равным нулю.
    list.innerHTML = "";
  }  
  
  

//create function that crosses out completed tasks.
// создаем функцию, которая пересекает завершенные задачи.

function strikeItem() {
    //'this' keyword refers to the item being clicked that triggers 
    //this function. Create a variable that stores the clicked item's 
    //parentNode into a variable. In this app the parentnode will refer to the <li> tag
    // Это ключевое слово относится к клику, который запускает триггеры
    // эта функция. Создайте переменную, в которой хранятся данные о клике
    // parentNode в переменную. В этом приложении родительский узел будет ссылаться на тег <li>
var parent = this.parentNode;
    //store the first child of the parentnode into a variable. in this app, the first child will be the <p> element created earlier.
    // сохраняем первый дочерний элемент родительского узла в переменную. 
    //В этом приложении первым дочерним элементом будет созданный ранее элемент <p>.
    var child = this.parentNode.firstChild;
    // the parentNode to the <li> tag which we stored into the 'parent' variable is the list. Store that into a variable.
    //// parentNode к тегу <li>, который мы сохранили в «родительской» переменной, - 
    //это список. Сохраняем это в переменной.
    var grandparent = parent.parentNode;
    //begin if statement to check if the task is crossed out or not. If textDecoration style of the first child (<p> tag) does NOT equal line-through
    // начинаем оператор if, чтобы проверить, пересечена ли задача или нет. 
    //Если стиль textDecoration для первого потомка (тег <p>) НЕ равен line-through
    if(child.style.textDecoration != "line-through"){
      //give it a text-decoration property with a line-through value
      // присвойте ему свойство text-decoration со строковым значением
      child.style.setProperty("text-decoration", "line-through");
      //then append the the parent div (the <li> tag) to the grandparent (the task list)
      // затем добавим родительский div (тег <li>) к прародителю (списку задач)
      grandparent.appendChild(parent);
    }
    //else if the textDecoration ofthe first child does equal to line-through
    // else, если текст Decoration первого дочернего элемента равен line-through
    else if (child.style.textDecoration === "line-through") {
      //set property of the child element to text-decoration none
      // устанавливаем свойство дочернего элемента text-decoration none
      child.style.setProperty("text-decoration","none");
      // once the item is uncrossed we move it back to the top of the task list using insertBefore, the first child of the grandparent.
      //Как только элемент не скроен, мы перемещаем его обратно в начало списка задач, 
      //используя insertBefore, первый дочерний элемент прародительницы.
      grandparent.insertBefore(parent, grandparent.firstChild);
    }
    //if none of these are true do nothing.
    // если ничего из этого не верно, ничего не делать.
    else{
      return false;
    }
  }
  
  
  
//Create function that deletes completed tasks. 
// Создать функцию, которая удаляет завершенные задачи.

function removeItem() {
    //use removeChild to remove the node to be deleted. For this to 
    //work we must first target the grandparent of the element triggering
    //the funtion ('this') then we target the parentnode of the same 
    //element. Then we attach the removeChild method to the grandparent, 
    //with the parent of 'this' as the value for removeChild.
    // использовать removeChild для удаления узла, который нужно удалить. Для этого
    // work, мы должны сначала нацелить дедушку-элемент запуска элемента
    // funtion ('this'), тогда мы указываем родительский узел того же самого
    //элемент. Затем мы присоединяем метод removeChild к прародителю,
    // с родительским элементом this в качестве значения для removeChild.
var parent = this.parentNode.parentNode;
var child = this.parentNode;
parent.removeChild(child);
}

}

toDoList();
