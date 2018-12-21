<template>
  <div
    v-resize:throttle="onResize"
    class="ellipsis"><slot/></div>
</template>

<script>
import resize from 'vue-resize-directive';

export default {
  directives: {
    resize
  },
  props: {
    ops: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return{
      totalText: ''
    };
  },
  mounted: function() {

    const suffix        = '…';
    const defGuess      = 16;
    const totalText     = this.$el.textContent;
    const multiNode     = this.ops ? this.ops.multiNode ? this.ops.multiNode : false : false;
    const $el           = this.$el;
    let   origTextMulti = [];
    let   $elMulti;

    const initOrigTextMulti = function() {

      if(multiNode) {

        $elMulti = $el.querySelectorAll(multiNode);

        $elMulti.forEach((textEl) => {

          origTextMulti.push(textEl.textContent);
          textEl.dataFullVal = textEl.textContent;

          textEl.restore = function() {
            this.textContent = this.dataFullVal;
          };
        });
      }
    };

    const restoreTextNodes = function() {
      if(multiNode) {
        $el.querySelectorAll(multiNode).forEach((textEl) => {
          textEl.restore();
        });
      }
    };

    initOrigTextMulti();

    const getTextNodes = function(elem) {
      let textNodes = [];
      if (elem) {
        for (let nodes = elem.childNodes, i = nodes.length; i--;) {
          let node = nodes[i], nodeType = node.nodeType;
          if (nodeType == 3) {
            textNodes.push(node);
          }else if (nodeType == 1 || nodeType == 9 || nodeType == 11) {
            textNodes = textNodes.concat(getTextNodes(node));
          }
        }
      }
      return textNodes;
    };

    this.respond = function() {

      const replaceTextNode = function(el, text) {

        let nText = getTextNodes(el);

        if(nText.length === 1) {
          nText[0].replaceWith(text);
          return true;
        } else if(multiNode === true) {
          el.text(text);
          return true;
        }
        return false;
      };

      const tryForSize = function(cmp, txt, length, suppressSuffix) {
        replaceTextNode(cmp, txt.substr(0, length) +  (suppressSuffix ? '' : suffix));
        return $el.scrollHeight <= $el.offsetHeight;
      };

      const locateMax = function(tgtCmp, nodeIndex, text, guess, bite, hone) {

        let newHone          = hone;
        let newBite          = 0;
        let newGuess         = 0;
        let suffixSuppressed = false;
        const $node          = tgtCmp[nodeIndex];

        if(guess > text.length) {
          newBite  = Math.max(1, bite/2);
          newGuess = guess - newBite;
        }else{
          suffixSuppressed = (guess === text.length) && (nodeIndex + 1 === tgtCmp.length);

          if(tryForSize($node, text, guess, suffixSuppressed)) {
            if(bite === 1) {
              return {
                guess: guess,
                index: nodeIndex,
                suffixSuppressed: suffixSuppressed
              };
            }else{
              newBite = hone ? Math.max(1, bite/2) : bite;
              newGuess = guess + newBite;
            }
          }else {
            if(guess < 1) {
              replaceTextNode($node, '');
              if(nodeIndex > 0) {
                replaceTextNode($node, '');
                const newIndex = nodeIndex -1;
                const resRecurse = locateMax(tgtCmp, newIndex, origTextMulti[newIndex], 1, Math.min(origTextMulti[newIndex].length, defGuess), false);
                return resRecurse;
              }else{
                return {
                  guess: 0,
                  index: nodeIndex,
                  suffixSuppressed: suffixSuppressed
                };
              }
            }
            newHone = true;
            newBite = hone ? Math.max(1, bite/2) : bite;
            newGuess = guess - newBite;
          }
        }
        return locateMax(tgtCmp, nodeIndex, text, newGuess, newBite, newHone);

      };

      if(multiNode) {
        restoreTextNodes();
        const text     = origTextMulti[origTextMulti.length-1];
        locateMax($elMulti, $elMulti.length-1, text, Math.floor(text.length/2), Math.floor(defGuess/2), false);
      }else {
        locateMax([$el], 0, totalText, Math.floor(totalText.length/2), defGuess, false);
      }
    };

    if(!this.responding) {
      this.responding = true;
      this.respond();
      const that = this;
      setTimeout(() => {
        that.responding = false;
      }, 100);
    }
  },
  methods:{
    onResize() {
      if(!this.responding) {
        this.respond();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .ellipsis{
    overflow: hidden;
  }
</style>
