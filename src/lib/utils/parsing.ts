interface ContentSegment {
	type: 'text' | 'code';
	content: string;
	language?: string;
}

export function decodeHtmlEntities(html: string): string {
	const textarea = document.createElement('textarea');
	textarea.innerHTML = html;
	return textarea.value;
}

// Function to parse content and extract code blocks
export function parseHtmlWithCodeBlocksRegex(htmlContent: string): ContentSegment[] {
	const segments: ContentSegment[] = [];
	const decodedContent = decodeHtmlEntities(htmlContent);
	const regex = /<pre><code(?:\s+class="language-(\w+)")?>([^]*?)<\/code><\/pre>/g;

	let lastIndex = 0;
	let match;

	while ((match = regex.exec(decodedContent)) !== null) {
		// Add text segment before code block if any
		if (match.index > lastIndex) {
			segments.push({
				type: 'text',
				content: htmlContent.substring(lastIndex, match.index)
			});
		}

		// Add code segment
		segments.push({
			type: 'code',
			language: match[1] || 'text',
			content: match[2]
		});

		lastIndex = match.index + match[0].length;
	}

	// Add remaining text if any
	if (lastIndex < htmlContent.length) {
		segments.push({
			type: 'text',
			content: htmlContent.substring(lastIndex)
		});
	}

	return segments;
}
