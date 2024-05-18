---
layout: compress
# WARNING: Don't use '//' to comment out code, use '{% comment %}' and '{% endcomment %}' instead.
---

{%- comment -%}
  See: <https://docs.mathjax.org/en/latest/options/input/tex.html#tex-options>
{%- endcomment -%}

MathJax = {
  tex: {
    {%- comment -%} start/end delimiter pairs for in-line math {%- endcomment -%}
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)']
    ],
    {%- comment -%} start/end delimiter pairs for display math {%- endcomment -%}
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]']
    ],
    {%- comment -%} equation numbering {%- endcomment -%}
    tags: 'ams'
    macros: {
      gasconstant: "{\\mathcal{R}}",
      avogadro: "{\\mathcal{N}_\\mathrm{A}}",
      boltzmann: "{k_\\mathrm{B}}",
      Pran: "{\\operatorname{\\mathrm{P\\kern-.03em r}}}",
      Reyn: "{\\operatorname{\\mathrm{R\\kern-.03em e}}}",
      Mach: "{\\operatorname{\\mathrm{M\\kern-.03em a}}}",
      d: ["{\operatorname{d}\!{#1}}", 1]
    }

  }
};
