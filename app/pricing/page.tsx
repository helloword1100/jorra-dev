"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { MobileHeader } from "@/components/layout/mobile-header"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Video, Share2, Zap, Crown, Gift, Heart } from "lucide-react"

export default function PricingPage() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 overflow-hidden">
          <MobileHeader />
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20 pb-20 md:pb-0">
            <div className="container mx-auto px-6 py-8 max-w-6xl">
              {/* Header Section */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F13DD4]/10 border border-primary/20 mb-6">
                  <Crown className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">BETA PROGRAM</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                  Free for Beta Testers
                </h1>
                <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Experience the future of AI hairstyle try-ons completely free during our beta phase
                </p>
              </div>

              {/* Beta Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg shadow-primary/5">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-[#F13DD4] flex items-center justify-center mb-4">
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">Free Beta Access</CardTitle>
                    <CardDescription>Unlimited hairstyle try-ons during beta</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-[#F13DD4]  mb-2">FREE</div>
                    <p className="text-sm text-muted-foreground">No credit card required</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary shadow-xl shadow-primary/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold">
                    POPULAR
                  </div>
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-[#F13DD4] flex items-center justify-center mb-4">
                      <Share2 className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">Social Media Bonus</CardTitle>
                    <CardDescription>Share your results and earn more try-ons</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-[#F13DD4]  mb-2">+5</div>
                    <p className="text-sm text-muted-foreground">Try-ons per #jorra post</p>
                  </CardContent>
                </Card>

                <Card className="border-accent/20  bg-[#F13DD4]/10 shadow-lg shadow-accent/5">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-[#F13DD4] flex items-center justify-center mb-4">
                      <Video className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-lg">Video Generation</CardTitle>
                    <CardDescription>Create dynamic videos of your try-ons</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-[#F13DD4] mb-2">10</div>
                    <p className="text-sm text-muted-foreground">Try-ons per video</p>
                  </CardContent>
                </Card>
              </div>

              {/* Features Section */}
              <Card className="mb-12 border-border/50 shadow-xl">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    What's Included in Beta
                  </CardTitle>
                  <CardDescription className="text-base md:text-lg">
                    Everything you need to transform your look
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">AI-Powered Try-Ons</h3>
                          <p className="text-sm text-muted-foreground">
                            Advanced AI technology for realistic hairstyle previews
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Video className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Video Generation</h3>
                          <p className="text-sm text-muted-foreground">
                            Create stunning videos showcasing your new hairstyle
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Share2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Social Sharing</h3>
                          <p className="text-sm text-muted-foreground">
                            Share your transformations and earn bonus try-ons
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Crown className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Premium Styles</h3>
                          <p className="text-sm text-muted-foreground">
                            Access to our entire library of hairstyles and trends
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Fast Processing</h3>
                          <p className="text-sm text-muted-foreground">
                            Lightning-fast AI processing for instant results
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Heart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Beta Support</h3>
                          <p className="text-sm text-muted-foreground">
                            Direct feedback channel to help shape the product
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media CTA */}
              <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20">
                <CardContent className="p-8 text-center">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Earn More Try-Ons</h2>
                    <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
                      Share your amazing transformations on social media with{" "}
                      <Badge variant="secondary" className="mx-1">
                        #jorra
                      </Badge>
                      and get 5 additional try-ons for each post!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg" className="bg-[#F13DD4] hover:bg-[#F13DD4]">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share on Social Media
                      </Button>
                      <Button size="lg" variant="outline" className="hover:bg-[#F13DD4] ">
                        <Video className="h-4 w-4 mr-2" />
                        Generate Video (10 try-ons)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Footer Note */}
              <div className="text-center mt-12 p-6 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Beta Program:</strong> Enjoy unlimited access during our beta
                  phase. Pricing will be introduced after beta completion with grandfathered benefits for early users.
                </p>
              </div>
            </div>
          </main>
          <MobileBottomNav />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
