<div class="fixed bottom-6 left-6 flex gap-1 bg-white rounded-full shadow-lg border border-gray-200 p-2 hover:shadow-xl transition-all duration-200 z-50">
  <button
    class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-150 active:bg-gray-200"
    on:click={() => open("https://revolut.me/davidkorff")}
    title="Donation"
    aria-label="Donation"
  >
    <img class="h-5 w-5" src="Coffee.svg" alt="Coffee" />
  </button>
  
  <div class="w-px bg-gray-200 my-1"></div>
  
  <button
    class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-150 active:bg-gray-200"
    on:click={() => open("https://github.com/addelec/latinum")}
    title="Source Code"
    aria-label="Source Code"
  >
    <img class="h-5 w-5" src="GitHub.svg" alt="GitHub Logo" />
  </button>
</div>
