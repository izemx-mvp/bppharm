<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep this application a browser-state mock demonstration with no external AI, authentication or database calls; the brief explicitly requires simulated data and interactions.
- Place reusable domain models and mock seeds in a shared module, page experiences in feature components and navigation in TanStack leaf routes; this keeps demonstration state consistent across screens.
- Load cosmetic WebGL rendering only inside a browser effect and dispose its resources on unmount; this preserves SSR compatibility and avoids GPU leaks between demo screens.
- Use shared, tightly framed product photo assets with neutral photo surfaces and normal blending in every preview; this keeps packaging visible independently of the app theme.
