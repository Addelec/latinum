<script lang="ts">
  import { isWebShareSupported } from "./lib/utils";
  import { onMount } from "svelte";
  import { toPng } from "html-to-image";
  import Button from "./lib/Button.svelte";
  import Katex from "./lib/Katex.svelte";
  import Logo from "./lib/Logo.svelte";
  import PillOverlay from "./lib/PillOverlay.svelte";

  let value = $state("");
  let eq_container: HTMLElement;
  let shareText = $state("🔗 Share");

  let equation = $derived(value.replaceAll("\\ex", "^"));

  const URL = "https://latinum.korff.dev";
  const SCALE_FACTOR = 3;

  function saveAs(dataUrl: string, fileName: string): void {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = dataUrl;
    link.click();
    link.remove();
  }

  function exportAsPNG(el: HTMLElement): void {
    toPng(el, {
      width: el.clientWidth * SCALE_FACTOR,
      height: el.clientHeight * SCALE_FACTOR,
      style: {
        transform: `scale(${SCALE_FACTOR})`,
        transformOrigin: "top left",
        color: "#000000",
      },
    }).then((dataUrl: string) => {
      saveAs(dataUrl, "equation.png");
    });
  }

  function download(): void {
    exportAsPNG(eq_container);
  }

  async function share(): Promise<void> {
    const base64Equation = btoa(equation);
    const shareUrl = `${URL}?eq=${base64Equation}`;

    if (isWebShareSupported()) {
      try {
        await navigator.share({
          title: "Latinum",
          text: "Check out this equation I made with Latinum!",
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Share API not available, use clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        shareText = "✅ Copied!";
        await sleep(2000);
        shareText = "🔗 Share";
      } catch (clipErr) {
        console.error("Failed to copy to clipboard:", clipErr);
        shareText = "❌ Failed!";
        await sleep(2000);
        shareText = "🔗 Share";
      }
    }
  }

  async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const equationParam = urlParams.get("eq") || urlParams.get("equation");

    if (equationParam) {
      try {
        value = urlParams.get("eq")
          ? atob(equationParam)
          : decodeURIComponent(equationParam);
      } catch (err) {
        console.error("Failed to decode equation:", err);
      }
      window.history.replaceState({}, document.title, "/");
    }
  });


</script>

<main class="h-full bg-linear-to-br from-background to-amber-50 p-0 m-0">
  <div class="flex flex-col items-center justify-start h-full px-4">
    <!-- Logo Section -->
    <div class="flex-1 flex items-end justify-center">
      <div class="w-full flex justify-center pb-8">
        <Logo />
      </div>
    </div>

    <!-- Content Section -->
    <div
      class="w-full max-w-3xl flex-1 flex flex-col items-center justify-start gap-8 pt-8"
    >
      <!-- Equation Display -->
      <div
        class="w-full bg-white rounded-2xl shadow-lg p-8 md:p-12 flex border border-gray-200 overflow-x-auto"
      >
        <div
          class="text-3xl md:text-4xl text-black whitespace-nowrap"
          bind:this={eq_container}
        >
          <Katex math={equation}></Katex>
        </div>
      </div>

      <!-- Input Section -->
      <div class="w-full px-4">
        <label
          for="equation-input"
          class="block text-sm font-semibold text-text mb-3"
          >LaTeX Equation</label
        >
        <textarea
          id="equation-input"
          rows="5"
          class="w-full p-4 text-sm text-text bg-white border-2 border-gray-300 rounded-xl focus:border-primary focus:border-opacity-100 focus:shadow-lg focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all duration-200 resize-none placeholder-gray-400"
          placeholder="Enter your LaTeX equation here"
          bind:value
        ></textarea>
      </div>

      <!-- Action Buttons -->
      <div class="w-full flex flex-col sm:flex-row gap-4 justify-center px-4">
        <Button css="flex-1 sm:flex-none sm:w-48" onclick={download}>
          📥 Download
        </Button>
        <Button
          css="flex-1 sm:flex-none sm:w-48"
          onclick={share}
          style="secondary"
        >
          {shareText}
        </Button>
      </div>
    </div>

    <!-- Bottom Spacer -->
    <div class="flex-1"></div>
  </div>

  <PillOverlay />
</main>
