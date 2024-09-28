const youtubedl = require("youtube-dl-exec");

export async function downloadYouTubeAudio(
  url: string,
  output: string
): Promise<string> {
  try {
    const result = await youtubedl(url, {
      extractAudio: true,
      audioFormat: "mp3",
      output: `${output}.%(ext)s`,
    });
    return `Audio downloaded successfully: ${output}.mp3`;
  } catch (error) {
    console.error("Error downloading YouTube audio:", error);
    return `Error downloading audio: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}
