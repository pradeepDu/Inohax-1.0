import { ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'

const Landing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-300 to-blue-500 text-primary-content">
            <header className="container flex justify-between items-center px-16 py-8">
                <Navbar></Navbar>
            </header>

            <main className="container mx-auto px-4 py-16">
                <section className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-down animate-once animate-duration-800 animate-delay-0 animate-ease-out">
                        Unlock Your Coding Potential
                    </h1>

                    <p className="text-xl md:text-2xl mb-8 animate-fade-down animate-once animate-duration-800 animate-delay-200 animate-ease-out">
                        Learn, Code, and Create with <span className=' font-robotoslab'>Samarthan</span>
                    </p>
                    <div className="animate-fade-up animate-once animate-duration-800 animate-delay-400 animate-ease-out">
                        <a className="btn btn-primary btn-lg px-8 rounded-full" href='/login'>
                            Get Started <ChevronRight className="ml-2" />
                        </a>
                    </div>
                </section>

                <section className="flex p-10 space-x-5 items-center justify-center">
                    <div className="card bg-primary text-primary-content w-96">
                        <div className="card-body">
                            <h2 className="card-title">AI Coding Tutor</h2>
                            <p>Learn coding with step by step guide with hints!</p>
                            <div className="card-actions justify-end">
                                <a className="btn" href="/ai-tutor">Check out!</a>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-primary text-primary-content w-96">
                        <div className="card-body">
                            <h2 className="card-title">Project Roadmap</h2>
                            <p>Get detailed Roadmap and Diagram for any project topic!</p>
                            <div className="card-actions justify-end">
                                <a className="btn" href="/project-roadmap">Check out!</a>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-primary text-primary-content w-96">
                        <div className="card-body">
                            <h2 className="card-title">AI Generated Quizzes</h2>
                            <p>Get AI Generated Quizzes on any topic of choice!</p>
                            <div className="card-actions justify-end">
                                <a className="btn" href="/login">Check out!</a>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <footer className="bg-neutral text-neutral-content py-8 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2024 <span className='font-robotoslab'>Samarthan</span> All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default Landing;