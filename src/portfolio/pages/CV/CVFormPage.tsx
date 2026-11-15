import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Sparkles } from 'lucide-react'

export function CVFormPage() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: 'Hamza Elkhatib',
        title: 'Software Developer',
        phone: '0569811150',
        email: 'h.k409383429@gmail.com',
        address: 'Palestine, Gaza, ElNasser',
        github: 'https://github.com/HamzaEezeldeen',
        summary: 'Dedicated and versatile Software Developer with a proven track record in delivering high-quality software solutions...',
        experience: 'Gaza Training College - Team Leader & ASP.NET Core Developer (1/2/2023 - 1/5/2023)\nDeveloped an Elderly Management System using ASP.NET Core, Bootstrap 5, and JavaScript/jQuery.',
        education: 'Gaza Training College - Diploma in Programming & Database (2021-2023, GPA: 85.6%)',
        skills: 'ASP.NET Core, JavaScript, TypeScript, jQuery, Bootstrap, Tailwind CSS, Git, GitHub, SQL Server',
        certifications: 'My Performance (FullStack Web Developer) - IMT Department at UNRWA HQG'
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // حفظ البيانات مؤقتاً في localStorage للانتقال لصفحة المعاينة
        localStorage.setItem('custom_cv_data', JSON.stringify(formData))
        navigate('/cv/preview')
    }

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-10">

                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="h-6 w-6 text-blue-600" /> CV Admin Builder
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Enter your details manually to generate your customized PDF resume.</p>
                    </div>
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
                        <ArrowLeft className="h-4 w-4" /> Home
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Job Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email</label>
                            <input type="text" name="email" value={formData.email} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">GitHub URL</label>
                            <input type="text" name="github" value={formData.github} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Professional Summary</label>
                        <textarea name="summary" rows={3} value={formData.summary} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Professional Experience</label>
                        <textarea name="experience" rows={4} value={formData.experience} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Education</label>
                        <textarea name="education" rows={2} value={formData.education} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Skills</label>
                            <textarea name="skills" rows={2} value={formData.skills} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Certifications</label>
                            <textarea name="certifications" rows={2} value={formData.certifications} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Sparkles className="h-4 w-4 text-yellow-400" /> Generate & Preview PDF
                    </button>
                </form>

            </div>
        </div>
    )
}