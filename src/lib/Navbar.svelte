<script>
  import { onMount } from "svelte";
  import { darkMode } from "../stores";

  onMount(() => {
    darkMode.subscribe((val) => {
      if (val === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    });

    window.onbeforeunload = () => {
      return "Are you sure you want to leave?";
    };
  });
</script>

<div
  class="absolute top-0 left-0 w-full bg-neutral-50 dark:bg-neutral-900 shadow-md flex flex-row justify-between items-center px-6 py-4 border-b-[0.75px] border-orange-500"
>
  <div class="font-semibold flex flex-col justify-start items-start">
    <div>Pedro Path Generator</div>
    <div class="text-xs font-extralight flex flex-row gap-1">
      by <p class="text-orange-500">#16166 WATT's UP</p>
    </div>
  </div>
  <div class="flex flex-row justify-end items-center gap-3">
    <a
      target="_blank"
      rel="norefferer"
      href="https://github.com/scama01/pedro-path-generator"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 30 30"
        class="size-8 dark:fill-white"
      >
        <path
          d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"
        ></path>
      </svg>
    </a>
    <button
      on:click={() => {
        darkMode.toggle();
      }}
    >
      {#if $darkMode === "light"}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      {/if}
    </button>
  </div>
</div>
