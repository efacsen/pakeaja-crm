# UI Iterate Command

Launch multiple concurrent UI design agents to create different design variations from a single reference.

## Usage
/ui-iterate [variants]

## Implementation

```bash
# Parse arguments
ARGUMENTS="$ARGUMENTS"
VARIANTS=3

# Check if variants number is provided
if [[ "$ARGUMENTS" =~ ^[0-9]+$ ]]; then
    VARIANTS=$ARGUMENTS
    if [ $VARIANTS -gt 10 ]; then
        echo "⚠️ Maximum 10 variants allowed, using 10"
        VARIANTS=10
    fi
fi

# Get current date
CURRENT_DATE=$(date +%Y_%m_%d)

# Create output directory
mkdir -p ui_iterations

echo "🚀 Claude UI Multi-Agent Iterator"
echo "================================"
echo "📁 Output: ./ui_iterations/"
echo "🎨 Creating $VARIANTS design variations"
echo "📅 Date: $CURRENT_DATE"
echo ""
Agent Approaches
I'll randomly select $VARIANTS approaches from these design philosophies:

Minimalist Clean - Focus on whitespace, essential elements only, monochromatic palette
Modern Bold - Vibrant gradients, strong shadows, animated elements, eye-catching CTAs
Glassmorphism - Frosted glass effects, transparency layers, soft UI, depth with blur
Neumorphic - Soft shadows, embossed effects, muted colors, tactile feel
Brutalist - Raw aesthetics, bold typography, harsh contrasts, unconventional layouts
Retro Future - 80s inspired, neon colors, synthwave aesthetics, geometric patterns
Corporate Professional - Conservative colors, grid layouts, formal typography
Playful Creative - Bright colors, rounded corners, fun animations, friendly vibe
Dark Mode First - Dark backgrounds, neon accents, high contrast, modern feel
Material Design - Google's design language, cards, FAB buttons, meaningful motion

Execution Plan
Step 1: Reference Check
First, I need to verify what reference material you've provided:

Screenshot (paste directly or use /add)
Website URL
Design file
Text description

If no reference is found, I'll ask: "Please provide a reference (screenshot, URL, or description) for the UI design."
Step 2: Agent Assignment
Based on $ARGUMENTS (or default 3), I'll assign each agent a unique design approach.
Step 3: Parallel Execution
For each agent (1 to $VARIANTS), I will:
🔍 Agent N: Analyzing reference...
📋 Agent N: Planning [approach name] design...
🏗️ Agent N: Creating HTML structure...
🎨 Agent N: Applying [approach] styles...
⚡ Agent N: Adding interactions...
💾 Agent N: Saving to ui_iterations/${CURRENT_DATE}_ui_N.html ✓
Step 4: File Generation
Each file will be saved as: ui_iterations/${CURRENT_DATE}_ui_${AGENT_NUMBER}.html
Template structure:
html<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UI Iteration - Agent ${AGENT_NUMBER}: ${APPROACH_NAME}</title>
    <style>
        /* Agent ${AGENT_NUMBER}: ${APPROACH_NAME} Styles */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        /* Design implementation based on ${APPROACH_NAME} philosophy */
        /* All styles inline - no external dependencies */
    </style>
</head>
<body>
    <!-- Agent ${AGENT_NUMBER} Design: ${APPROACH_NAME} -->
    
    <script>
        console.log('UI Agent ${AGENT_NUMBER} - Approach: ${APPROACH_NAME}');
        // Interaction code here
    </script>
</body>
</html>
Step 5: Create Viewer
I'll also create ui_iterations/index.html with:
html<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UI Iterations Viewer - ${VARIANTS} Variants</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            max-width: 1400px;
            margin: 0 auto;
        }
        .preview {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .preview-header {
            padding: 15px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }
        iframe {
            width: 100%;
            height: 600px;
            border: none;
        }
    </style>
</head>
<body>
    <h1>UI Iterations - ${VARIANTS} Variants</h1>
    <div class="grid">
        <!-- Iframes for each variant will be inserted here -->
    </div>
</body>
</html>
Step 6: Summary Report
✅ Created ${VARIANTS} UI variations

| Agent | Approach | File |
|-------|----------|------|
| 1 | [Approach Name] | ui_iterations/${CURRENT_DATE}_ui_1.html |
| 2 | [Approach Name] | ui_iterations/${CURRENT_DATE}_ui_2.html |
...

To view all designs:
1. open ui_iterations/*.html
2. cd ui_iterations && python -m http.server 8000
3. Open ui_iterations/index.html in your browser
Examples
Default (3 variants):
/ui-iterate
Custom variants:
/ui-iterate 5
/ui-iterate 10
Error Handling
bashif [ -z "$REFERENCE_FOUND" ]; then
    echo "❌ No reference provided!"
    echo "Please provide one of the following:"
    echo "- Paste a screenshot"
    echo "- Include a URL: https://example.com"
    echo "- Use /add to add a design file"
    exit 1
fi