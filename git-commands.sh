git status

# First, open the conflicted file in your preferred editor
# After manually resolving the conflicts in layout/theme.liquid

# Add the resolved file to mark it as resolved
git add layout/theme.liquid

# Add any other modified or new files
git add sections/homepage.liquid
git add snippets/responsive-image.liquid
git add assets/image-handler.js
git add assets/theme.scss
git add assets/neural-bus.js
git add assets/qear-webgl-bridge.js
git add assets/ritual-engine.js
git add snippets/quantum-image.liquid
git add snippets/product-card.liquid
git add snippets/pagination.liquid
git add snippets/icon-search.liquid
git add snippets/icon-cart.liquid
git add snippets/icon-account.liquid
git add snippets/quantum-layer.liquid
git add assets/trauma-encodings.css
git add assets/quantum-effects.css
git add config/settings_schema.json

# Complete the merge with a commit
git commit -m "Resolve merge conflicts and implement VoidBloom theme improvements"
