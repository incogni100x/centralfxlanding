// Contact Form Handler for Supabase Edge Function
class ContactFormHandler {
  constructor() {
    // Supabase Edge Function URL for contact form
    this.edgeFunctionUrl = 'https://ybbcpedqjjkdivozbswk.supabase.co/functions/v1/contact-form'
  }

  async submitContactForm(formData) {
    try {
      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit contact form')
      }

      return result
    } catch (error) {
      console.error('Error submitting contact form:', error)
      throw error
    }
  }

  // Initialize form handling
  init() {
    const form = document.querySelector('form')
    if (!form) return

    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      
      const submitButton = form.querySelector('button[type="submit"]')
      const originalText = submitButton.textContent
      
      // Show loading state
      submitButton.textContent = 'Sending...'
      submitButton.disabled = true

      try {
        // Get form data
        const formData = {
          full_name: form.querySelector('input[name="full_name"]').value,
          email: form.querySelector('input[name="email"]').value,
          subject: form.querySelector('input[name="subject"]').value,
          message: form.querySelector('textarea[name="message"]').value,
        }

        // Submit to Supabase Edge Function
        const result = await this.submitContactForm(formData)
        
        // Show success message
        this.showMessage('Thank you for your message! We will get back to you within 24 hours.', 'success')
        
        // Reset form
        form.reset()
        
      } catch (error) {
        // Show error message
        this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error')
        console.error('Form submission error:', error)
      } finally {
        // Reset button state
        submitButton.textContent = originalText
        submitButton.disabled = false
      }
    })
  }

  showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.contact-message')
    if (existingMessage) {
      existingMessage.remove()
    }

    // Create message element
    const messageEl = document.createElement('div')
    messageEl.className = `contact-message p-4 rounded-lg mb-4 ${
      type === 'success' 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : type === 'error'
        ? 'bg-red-100 text-red-800 border border-red-200'
        : 'bg-blue-100 text-blue-800 border border-blue-200'
    }`
    messageEl.textContent = message

    // Insert message before the form
    const form = document.querySelector('form')
    form.parentNode.insertBefore(messageEl, form)

    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.remove()
        }
      }, 5000)
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const contactHandler = new ContactFormHandler()
  contactHandler.init()
})