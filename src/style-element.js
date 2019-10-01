const styleElement = document.createElement('dom-module');
styleElement.innerHTML =
  `<template>
  <style>
  /* __________________________________________________ Common elements and classes __________________________________________________ */
    h1 {
      color: white;      
      @apply --paper-font-headline;
      padding-left: 20px;      
      font-weight: bold;      
    }
    h3 {
      padding: 0px;
    }
    ul {
      padding-left:5px;    
      background-color: white;     
      list-style-type: none;    
    }
    paper-button {
      background-color: #ececec;                    
      color: black;                                
      font-size: 0.9em;
      @apply(--shadow-elevation-2dp);                                              
    }
    paper-button[active] {
      background-color: #0073B0;
      color: white;
      @apply(--shadow-elevation-4dp);                                              
    }
    paper-button:hover {
      background-color: #e0effa;
      color: black;      
      @apply(--shadow-elevation-4dp);                                                          
    }
    paper-button.disabled {
      color: white;
      background-color: bisque;
    }
    li {
      padding-bottom: 2.5px;
    }
    .tk-luokituspuu-li:hover, .tk-luokkahaku-li:hover {
      background-color: #e0effa;
      cursor: pointer;      
    }
    .selected {
      background-color: #e0effa;
      font-weight: bold;
    }
    
    .corresponding {
      font-weight: bold;
    }
    .classificationButtons {
      float: left;
    }
    .languageButtons {
      float: right;
    }
    .classCode {
    
    }
    .className {
    }
    .intendation {
    
    }
    
    ::placeholder {
      font-size: 12pt;
      font-style: italic;
      color: grey;
      opacity: 1; /* Firefox */
    }
    :-ms-input-placeholder { /* Internet Explorer 10-11 */
     color: grey;
     font-style: italic;
     font-size: 12pt;     
    }
    ::-ms-input-placeholder { /* Microsoft Edge */
     color: grey;
     font-style: italic;
     font-size: 12pt;     
    }
    /* __________________________________________________ tk-luokkahaku ___________________________________________________*/ 
    .tk-luokkahaku-body {
      visibility: visible;      
    }
    .tk-luokkahaku-ul {
      position: absolute;
      @apply(--shadow-elevation-8dp);     
      width: 46.75%;
      margin-top: 0px;
      max-height: 200px;
      overflow:auto;
      z-index: 2;
    }
    .tk-luokkahaku-input {
      display: inline-block;
      width: 100%;
      padding: 8px 16px;
      display: inline-block;
      border: 1px solid #bcbcbc;
      border-radius: 2px;
      box-sizing: border-box;
      font-size: 1.2em;
      // background: url("suurennuslasi.png") no-repeat scroll 7px 7px; 
      background-position: right;         
      background-color: #f7f7f7;
      @apply(--shadow-elevation-2dp);    
    }
    .tk-luokkahaku-input::-webkit-search-cancel-button {
      position:relative;
      right:20px;    
    }
    .tk-luokkahaku-input::-ms-clear{
      margin-right:20px  
    }
    .tk-luokkahaku-input:focus {
      border: 0.25px solid #e0effa;
      @apply(--shadow-elevation-4dp);              
    }
    .tk-luokkahaku-iron-input {        /* When styling input, you may need to apply same styles to iron-input too. */
      width: 100%;
    }
    .tk-luokkahaku-template {
      
    }
    /* __________________________________________________ tk-luokituspuu __________________________________________________*/ 
    .tk-luokituspuu-body {
      visibility: visible;
      @apply(--shadow-elevation-2dp);
      background-color: #0073b0;
    }
    .tk-luokituspuu-open {
      color: white;
      float:right;
    }
    .tk-luokituspuu-open:hover {
      cursor: pointer;      
    }
    .tk-luokituspuu-ul {
      clear:both;        
      @apply(--shadow-elevation-2dp);       
    }
    .tk-luokituspuu-li {
      position: relative;
      white-space: pre-wrap;
    }
    .tk-luokituspuu-h1 {
      padding-top: 12px;   
      padding-bottom: 12px;
      margin: 0;
      float: left;           
    }
    .tk-luokituspuu-template {
      
    }
    .tk-luokituspuu-classCode {
      
    }
    
    .tk-luokituspuu-className {
      
    }
    
    .tk-luokituspuu-intendation {
            
    }
    /* __________________________________________________ tk-valinta ________________________________________________________*/
    .tk-valinta-body {   
      @apply(--shadow-elevation-2dp);                                              
      visibility: hidden;
      background-color: #0073b0; 
    }
    .tk-valinta-iron-list {
      @apply(--shadow-elevation-2dp); 
      background-color: white;
      padding-left: 20px;   
      max-height:360px;                    
    }
    .tk-valinta-h1 {
      padding-top: 12px;   
      padding-bottom: 12px;
      margin: 0;
    }
    .tk-valinta-li {
      padding: 5px;
      white-space: pre-wrap;
    }
    .tk-valinta-ul {
    }
    .tk-valinta-ul li:nth-child(n+2) {
      font-size: 0.9em;
      line-height: 0.95em;
    }
    .tk-valinta-description {
      line-height: 1.1em;
    }
    .keywordsHeader, .excludesHeader, .includesHeader, .includesAlsoHeader {
      font-weight:bold;
      font-size: 1em;
    }
    .tk-valinta-keywords {
    }
    .tk-valinta-keywords:hover {
    }
    .tk-valinta-h3 {
      font-size: 1em;
      margin: 0;
      padding-top: 10px;
      padding-bottom: 2px;
    }
    .tk-valinta-ul {
      padding-top: 0px;
      margin-top: 0px;
    }
    
    /* __________________________________________________ tk-lahdeluokitus __________________________________________________*/
    .tk-lahdeluokitus-body {
      visibility: visible;      
    }
  </style>
</template>`;
styleElement.register('style-element');
