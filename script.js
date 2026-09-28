(function(){
  "use strict";

  /* ============ LOADER ============ */
  window.addEventListener('load', function(){
    var loader = document.getElementById('loader');
    setTimeout(function(){
      loader.classList.add('hidden');
    }, 600);
  });
  // failsafe in case 'load' is delayed
  setTimeout(function(){
    document.getElementById('loader').classList.add('hidden');
  }, 3200);

  /* ============ PARTICLE NETWORK CANVAS ============ */
  var canvas = document.getElementById('particle-canvas');
  var ctx = canvas.getContext('2d');
  var particles = [];
  var W, H;
  var PARTICLE_COUNT;

  function sizeCanvas(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    PARTICLE_COUNT = Math.max(36, Math.min(90, Math.floor((W * H) / 22000)));
  }

  function initParticles(){
    particles = [];
    for(var i = 0; i < PARTICLE_COUNT; i++){
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6
      });
    }
  }

  function drawParticles(){
    ctx.clearRect(0, 0, W, H);

    for(var i = 0; i < particles.length; i++){
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if(p.x < 0 || p.x > W) p.vx *= -1;
      if(p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(94, 230, 217, 0.55)';
      ctx.fill();
    }

    var maxDist = Math.min(150, W / 6);
    for(var i = 0; i < particles.length; i++){
      for(var j = i + 1; j < particles.length; j++){
        var a = particles[i], b = particles[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if(dist < maxDist){
          var alpha = (1 - dist / maxDist) * 0.16;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(255, 138, 61, ' + alpha + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  sizeCanvas();
  initParticles();
  drawParticles();

  var resizeTimer;
  window.addEventListener('resize', function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){
      sizeCanvas();
      initParticles();
    }, 200);
  });

  /* ============ SCROLL REVEAL (IntersectionObserver) ============ */
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(function(el){ revealObserver.observe(el); });

  /* ============ SKILL BARS — ANIMATE ON VIEWPORT ENTRY ============ */
  var skillRows = document.querySelectorAll('.skill-row');
  var skillObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var level = entry.target.getAttribute('data-level');
        var fill = entry.target.querySelector('.skill-fill');
        fill.style.width = level + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillRows.forEach(function(row){ skillObserver.observe(row); });

  /* ============ MARQUEE — BUILD CONTENT ============ */
var companies = [
  'Insurance CCM',
  'SmartCOMM',
  'OpenText Exstream',
  'OpenText Cloud Native',
  'Business Rules',
  'Document Generation',
  'Rally',
  'Pure Insurance',
  'Acuity Insurance'
];
  var track = document.getElementById('marqueeTrack');
  function buildMarquee(){
    var html = '';
    for(var rep = 0; rep < 2; rep++){
      companies.forEach(function(name){
        html += '<span class="marquee-item">' + name + ' <span class="dash">//</span></span>';
      });
    }
    track.innerHTML = html;
  }
  buildMarquee();

  /* ============ NAV — MOBILE: SMOOTH ANCHOR SCROLL CLOSE (no menu needed, kept minimal) ============ */
  document.querySelectorAll('.nav-links a, .nav-cta').forEach(function(link){
    link.addEventListener('click', function(e){
      var href = this.getAttribute('href');
      if(href.charAt(0) === '#'){
        var target = document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

})();