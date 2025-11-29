// Small helper script: set year and smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', function(){
  var y = new Date().getFullYear();
  var el = document.getElementById('year');
  if(el) el.textContent = y;

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });

  // Contact form handling
  var form = document.getElementById('contact-form');
  if(!form) return;

  var statusEl = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');

  function showError(name, message){
    // set invalid-feedback text and bootstrap is-invalid class
    var fb = form.querySelector('.invalid-feedback[data-for="'+name+'"]');
    if(fb){ fb.textContent = message; }
    var input = form.querySelector('[name="'+name+'"]');
    if(input){ input.classList.add('is-invalid'); }
  }
  function clearErrors(){
    form.querySelectorAll('.invalid-feedback').forEach(function(e){ e.textContent=''; });
    form.querySelectorAll('.is-invalid').forEach(function(i){ i.classList.remove('is-invalid'); });
  }

  function validateEmail(email){
    // Simple RFC-like check
    return /^\S+@\S+\.\S+$/.test(email);
  }

  form.addEventListener('submit', function(ev){
    ev.preventDefault();
    clearErrors();
    if(submitBtn) submitBtn.disabled = true;

    // Honeypot check
    var hp = form.querySelector('[name="website"]');
    if(hp && hp.value.trim() !== ''){
      // likely bot
      if(statusEl){ statusEl.hidden = false; statusEl.textContent = 'Submission blocked.'; }
      if(submitBtn) submitBtn.disabled = false;
      return;
    }

    var name = (form.querySelector('[name="name"]') || {}).value || '';
    var email = (form.querySelector('[name="email"]') || {}).value || '';
    var phone = (form.querySelector('[name="phone"]') || {}).value || '';
    var company = (form.querySelector('[name="company"]') || {}).value || '';
    var message = (form.querySelector('[name="message"]') || {}).value || '';

    var ok = true;
    if(!name.trim()){ showError('name','Please enter your name'); ok=false; }
    if(!email.trim()){ showError('email','Please enter your email'); ok=false; }
    else if(!validateEmail(email.trim())){ showError('email','Please enter a valid email address'); ok=false; }
    if(!message.trim()){ showError('message','Please enter a message'); ok=false; }

    if(!ok){ if(submitBtn) submitBtn.disabled = false; return; }

    // prepare mailto link
    var to = 'evdeni30@gmail.com';
    var subject = encodeURIComponent('Website inquiry from ' + name.trim());
    var bodyLines = [];
    bodyLines.push('Name: ' + name.trim());
    bodyLines.push('Email: ' + email.trim());
    if(phone.trim()) bodyLines.push('Phone: ' + phone.trim());
    if(company.trim()) bodyLines.push('Company: ' + company.trim());
    bodyLines.push('');
    bodyLines.push('Message:');
    bodyLines.push(message.trim());
    var body = encodeURIComponent(bodyLines.join('\n'));

    var mailto = 'mailto:' + encodeURIComponent(to) + '?subject=' + subject + '&body=' + body;

    // show a brief success status and open mail client
    if(statusEl){ statusEl.hidden = false; statusEl.textContent = 'Preparing email and opening your mail client...'; }

    // open user's mail client
    window.location.href = mailto;

    // After attempting to open mail client, clear the form (user may still need to send from their mail app)
    form.reset();
    setTimeout(function(){
      if(statusEl){ statusEl.textContent = 'If your mail client did not open, you can reach us at evdeni30@gmail.com'; }
      if(submitBtn) submitBtn.disabled = false;
    }, 1200);
  });
});
