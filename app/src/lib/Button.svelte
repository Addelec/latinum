<script>
  export let onclick = () => {};

  export let style = "primary";
  export let css = "";

  let tailwind = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 text-white shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-1 active:scale-95 ";

  switch(style) {
    default:
    case "primary":
      tailwind += "bg-blue-600 hover:bg-blue-700 active:bg-blue-800";
      break;
    case "secondary":
      tailwind += "bg-green-600 hover:bg-green-700 active:bg-green-800";
      break;
  }

</script>

<button class={tailwind + " " + css} on:click={onclick}><slot></slot></button>
