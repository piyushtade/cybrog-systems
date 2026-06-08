/* ==========================================================================
   Cybrog Systems Custom Frontend Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Navigation Scroll Effect
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // 3. Neural-Network Particle Background Canvas
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let numParticles = 60;

        // Resize Canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Adjust particle density based on screen size
            if (window.innerWidth < 768) {
                numParticles = 25;
            } else {
                numParticles = 60;
            }
            createParticles();
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
                ctx.fill();
            }
        }

        const createParticles = () => {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        };

        const drawConnections = () => {
            const maxDistance = 120;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        const alpha = (1 - (dist / maxDistance)) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConnections();
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }

    // 4. Interactive n8n Workflow Simulator
    const btnRunWf = document.getElementById('btn-run-workflow');
    const wfStatusLight = document.getElementById('wf-status-light');
    const wfStatusText = document.getElementById('wf-status-text');
    const consoleLogs = document.getElementById('console-logs');

    // List of nodes and connectors
    const nodes = [
        document.getElementById('node-trigger'),
        document.getElementById('node-router'),
        document.getElementById('node-ai'),
        document.getElementById('node-whatsapp'),
        document.getElementById('node-crm')
    ];
    const lines = [
        document.getElementById('line-1'),
        document.getElementById('line-2'),
        document.getElementById('line-3'),
        document.getElementById('line-4')
    ];

    const logsDatabase = [
        { node: 0, text: "[SYSTEM] Web lead inbound trigger fired from client portal contact form." },
        { line: 0, text: "[n8n ROUTING] Transferring raw lead parameters to secure integration gateway." },
        { node: 1, text: "[n8n GATEWAY] Webhook parsed. Validating business email format and phone string." },
        { line: 1, text: "[n8n ROUTING] Schema verified. Forwarding contextual request metadata to AI Engine." },
        { node: 2, text: "[AI AGENT] Running cognitive analysis... Classifying interest and computing initial sentiment score." },
        { line: 2, text: "[n8n ROUTING] Analysis compiled. Orchestrating WhatsApp outbound notifications API." },
        { node: 3, text: "[WHATSAPP BOT] Dispatching conversational follow-up message to recipient. Session active." },
        { line: 3, text: "[n8n ROUTING] Outbound success. Syncing records to central CRM repository." },
        { node: 4, text: "[CRM DASHBOARD] Lead status updated to 'Autonomous Contact Made'. Sync finalized." }
    ];

    let wfRunning = false;

    const addLogLine = (text, type = 'normal') => {
        const lineDiv = document.createElement('div');
        lineDiv.className = `log-line ${type === 'green' ? 'text-green' : type === 'cyan' ? 'text-cyan' : ''}`;
        lineDiv.textContent = text;
        consoleLogs.appendChild(lineDiv);
        consoleLogs.scrollTop = consoleLogs.scrollHeight;
    };

    const runWorkflow = async () => {
        if (wfRunning) return;
        wfRunning = true;
        
        // Reset state
        nodes.forEach(n => n.className = 'wf-node');
        lines.forEach(l => l.className.baseVal = '');
        consoleLogs.innerHTML = '';
        btnRunWf.disabled = true;
        
        wfStatusLight.className = 'status-indicator active';
        wfStatusText.textContent = 'Workflow Active';
        
        addLogLine('[SYSTEM] Initiating automation stack trigger...', 'cyan');

        // Sequence steps
        const stepDelay = 1000;
        
        for (let i = 0; i < logsDatabase.length; i++) {
            const step = logsDatabase[i];
            
            if (step.hasOwnProperty('node')) {
                const nodeIdx = step.node;
                nodes[nodeIdx].classList.add('active');
                addLogLine(step.text);
            } else if (step.hasOwnProperty('line')) {
                const lineIdx = step.line;
                lines[lineIdx].className.baseVal = 'active';
                addLogLine(step.text, 'cyan');
            }
            
            // Wait for duration before next sequence item
            await new Promise(resolve => setTimeout(resolve, stepDelay));
            
            // Convert previous active node to complete
            if (step.hasOwnProperty('node')) {
                const nodeIdx = step.node;
                nodes[nodeIdx].classList.remove('active');
                nodes[nodeIdx].classList.add('complete');
            } else if (step.hasOwnProperty('line')) {
                const lineIdx = step.line;
                lines[lineIdx].className.baseVal = 'complete';
            }
        }

        // Finalize completed state
        wfStatusLight.className = 'status-indicator complete';
        wfStatusText.textContent = 'Automation Complete';
        addLogLine('[SYSTEM] Workflow executed successfully. All database systems nominal.', 'green');
        
        // Re-enable trigger button after 4 seconds
        setTimeout(() => {
            btnRunWf.disabled = false;
            wfRunning = false;
            wfStatusLight.className = 'status-indicator';
            wfStatusText.textContent = 'Engine Idle';
        }, 4000);
    };

    if (btnRunWf) {
        btnRunWf.addEventListener('click', runWorkflow);
    }

    // 5. Interactive WhatsApp Chatbot Simulator
    const chips = document.querySelectorAll('.chat-chip');
    const messagesContainer = document.getElementById('chat-messages-container');
    const dummyInput = document.getElementById('dummy-input');

    const botReplies = {
        "How can AI automation help my business?": "AI automation can eliminate up to 80% of repetitive data tasks. By integrating AI models directly into your systems, we automate client profiling, ticket categorization, and database management, letting your team focus on core sales.",
        "What workflows can you automate with n8n?": "With n8n, we sync apps seamlessly. Examples include: automatically pushing web form leads to Salesforce/Hubspot, processing attachments from emails via OCR and updating Slack, or coordinating data backups and automated reports across all your cloud providers.",
        "How long does custom website development take?": "A standard corporate website takes about 2-3 weeks, while complex full-stack web platforms with backend integrations may take 4-6 weeks. Every build is SEO-optimized, responsive, and blazingly fast.",
        "Can you set up an agent registered to our database?": "Absolutely! We connect AI agents securely to your SQL, PostgreSQL, or MongoDB databases. The bot can retrieve real-time inventory, verify booking statuses, or update customer records securely with encrypted protocols."
    };

    const getFormattedTime = () => {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    };

    const addMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        
        const textNode = document.createTextNode(text);
        msgDiv.appendChild(textNode);
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = getFormattedTime();
        msgDiv.appendChild(timeSpan);
        
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const question = chip.getAttribute('data-question');
            if (!question || !botReplies[question]) return;

            // Update input placeholder to show action
            dummyInput.textContent = question;
            dummyInput.style.color = '#fff';

            // Disable all chips during conversation turn
            chips.forEach(c => c.disabled = true);

            // User Message
            setTimeout(() => {
                addMessage(question, 'sent');
                dummyInput.textContent = "Typing...";
                dummyInput.style.color = '#8696a0';
            }, 400);

            // Bot response
            setTimeout(() => {
                addMessage(botReplies[question], 'received');
                dummyInput.textContent = "Click a chip on the left...";
                // Re-enable chips
                chips.forEach(c => c.disabled = false);
            }, 1600);
        });
    });

    // 6. Contact Form Submission simulation
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('btn-submit-form');
    const resetBtn = document.getElementById('btn-reset-form');
    const spinner = submitBtn ? submitBtn.querySelector('.submit-spinner') : null;

    if (contactForm && formSuccess && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check form validity
            if (!contactForm.checkValidity()) return;

            // Show loading
            submitBtn.disabled = true;
            if (spinner) spinner.classList.remove('hidden');
            const submitSpan = submitBtn.querySelector('span');
            if (submitSpan) submitSpan.textContent = 'Registering...';

            // Simulate server network roundtrip
            setTimeout(() => {
                // Reset button state
                submitBtn.disabled = false;
                if (spinner) spinner.classList.add('hidden');
                if (submitSpan) submitSpan.textContent = 'Submit Request';

                // Display success overlay
                contactForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
            }, 1800);
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                contactForm.reset();
                formSuccess.classList.add('hidden');
                contactForm.classList.remove('hidden');
            });
        }
    }

    // 7. Cyborg Eye Mouse Tracking Interaction
    const eyeSvg = document.querySelector('.hero-eye');
    if (eyeSvg) {
        const iris = eyeSvg.querySelector('.eye-iris');
        const pupil = eyeSvg.querySelector('.eye-pupil');
        
        // Establish SVG transform origins
        pupil.style.transformOrigin = '150px 150px';
        iris.style.transformOrigin = '150px 150px';
        
        document.addEventListener('mousemove', (e) => {
            const rect = eyeSvg.getBoundingClientRect();
            const eyeX = rect.left + rect.width / 2;
            const eyeY = rect.top + rect.height / 2;
            
            const dx = e.clientX - eyeX;
            const dy = e.clientY - eyeY;
            const angle = Math.atan2(dy, dx);
            
            // Limit movement offset range (px)
            const maxDistPupil = 12;
            const maxDistIris = 6;
            
            // Calculate scale distance relative to viewport bounds
            const dist = Math.hypot(dx, dy);
            const pupilShift = Math.min(maxDistPupil, dist / 45);
            const irisShift = Math.min(maxDistIris, dist / 70);
            
            const px = Math.cos(angle) * pupilShift;
            const py = Math.sin(angle) * pupilShift;
            const ix = Math.cos(angle) * irisShift;
            const iy = Math.sin(angle) * irisShift;
            
            // Translate SVG nodes dynamically
            pupil.style.transform = `translate(${px}px, ${py}px)`;
            iris.style.transform = `translate(${ix}px, ${iy}px)`;
        });
        
        // Return eye parts to rest position on window exit
        document.addEventListener('mouseleave', () => {
            pupil.style.transition = 'transform 0.3s ease-out';
            iris.style.transition = 'transform 0.3s ease-out';
            pupil.style.transform = 'translate(0px, 0px)';
            iris.style.transform = 'translate(0px, 0px)';
            
            // Reset transition delay after reset completes
            setTimeout(() => {
                pupil.style.transition = 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                iris.style.transition = 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, 300);
        });
    }
});
